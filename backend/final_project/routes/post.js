import { Router } from "express";
import { Post, ClickView, Purchases } from "../models/post.js";
import Tag from "../models/tag.js";
import purify from "../../utils/sanitize.js";
import {
  createPostValitation,
  updatePostValitation,
} from "../../valitations/post.js";
import {
  isAdmin,
  verifyToken,
  verifyTokenOptional,
} from "../../utils/token.js";

const router = Router();

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Somthing went wrong with getting posts" });
  }
});

// GET all posts by author_id: req.user.id
router.get("/my-cards", [verifyToken], async (req, res) => {
  try {
    const posts = await Post.find({ author_id: req.user.id });
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Somthing went wrong with getting posts" });
  }
});

//GET all posts by :id
router.get("/:id", [verifyTokenOptional], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send({ message: "Post not found" });

    const visitorId = req.user?.id || req.ip;

    //Number of views of the user
    const ref = req.query.ref
      ? Buffer.from(req.query.ref, "base64").toString("utf-8")
      : null;

    if (ref && visitorId) {
      const exists = await ClickView.findOne({
        post_id: post._id,
        referrer_username: ref,
        visitor_id: visitorId,
      });

      if (!exists) {
        await ClickView.create({
          post_id: post._id,
          referrer_username: ref,
          visitor_id: visitorId,
        });
      }
    }

    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Somthing went wrong with getting post" });
  }
});

//POST Amount of freedom for the user
router.post("/:id/purchases", [verifyTokenOptional], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send({ message: "Post not found" });

    const PurchaserId = req.user?.id || req.ip;
    const ref = req.body.ref;

    const purchases = await Purchases.create({
      post_id: post._id,
      referrer_username: ref || "", // מי פירסם את הכרטיס
      Purchaser_id: PurchaserId, // מזהה את הקונה של הכרטיס כדי לדעת מי קנה וכמה
      price: post.price,
    });

    res.status(200).send({ message: "Purchase saved", data: purchases });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong with purchase" });
  }
});

//GET Sales statistics per user
router.get("/:username/stats", async (req, res) => {
  try {
    const username = req.params.username;

    const clickView = await ClickView.countDocuments({
      referrer_username: username,
    }); //סופר כמה צפיות היו למשתמש הזה לפי התנאי ששמת

    const purchases = await Purchases.find({ referrer_username: username }); //לך למודול הנל ותמצא לי כמה רכישות יש למשתמש הזה
    const ticketsSold = purchases.length; //סופר את כמות הרכישות שיש למשתמש בפועל
    const commissionsPerPurchase = purchases.map((p) => p.price * 0.1); // לוקח את ה-10 אחוז עמלה מכל רכישה
    const totalCommission = commissionsPerPurchase.reduce(
      (sum, c) => sum + c,
      0
    ); // מחשב כמה עמלה המשתמש צבר
    const totalRevenue = purchases.reduce((sum, p) => sum + p.price, 0); // מחשב את סהכ ההכנסות של המשתמש למערכת

    res.status(200).send({
      username,
      clickView,
      ticketsSold,
      totalRevenue,
      totalCommission,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong with stats" });
  }
});

//GET all post with Query
router.get("/tag", async (req, res) => {
  try {
    //מוודא לי שהערך שאני מקבל תמיד יהיה כמערך גם אם הוא ערך בודד
    const reqQuery = Array.isArray(req.query.tag)
      ? req.query.tag
      : [req.query.tag];

    const tags = await Tag.find({
      //מחפש לי לפי הקווארי את הערך במערך של טאג
      name: { $in: reqQuery },
    });
    if (tags.length === 0) return res.status(404).send("tag not found!");

    //עבור כל טאג שמצאת תמצא את האיידי שלו
    const tagId = tags.map((tag) => tag._id);

    //תביא לי את הפוסט שאותו טאג שמצאת נמצא בו
    const post = await Post.find({ tags: { $in: tagId } }).populate("tags");
    //בגלל שפוסט זה מערך לכן הבדיקה נעשית לפי אורך המערך
    if (post.length === 0) return res.status(404).send("post not found!");

    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res.status(500).send("Somthing went wrong with getting post");
  }
});

//POST create new post
router.post("/", [verifyToken], async (req, res) => {
  console.log("req.user:", req.user);

  Object.keys(req.body).forEach((key) => {
    //אם הערך שווה למערך אז תיכנס לתוך המערך ותבדוק האם יש בעיה אבל תשאיר לי אותו כמערך
    if (Array.isArray(req.body[key])) {
      req.body[key] = req.body[key].map((tag) => purify.sanitize(tag));
    } else {
      req.body[key] = purify.sanitize(req.body[key]); //ואם הוא לא מערך תמשיך את הבדיקה כרגיל
    }
  });

  const { error } = createPostValitation.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const post = await Post.create({ ...req.body, author_id: req.user.id });
  res.status(200).send(post);
});

//PUT post
router.put("/:id", [verifyToken], async (req, res) => {
  Object.keys(req.body).forEach((key) => {
    //אם הערך שווה למערך אז תיכנס לתוך המערך ותבדוק האם יש בעיה אבל תשאיר לי אותו כמערך
    if (Array.isArray(req.body[key])) {
      req.body[key] = req.body[key].map((tag) => purify.sanitize(tag));
    } else {
      req.body[key] = purify.sanitize(req.body[key]); //ואם הוא לא מערך תמשיך את הבדיקה כרגיל
    }
  });

  const { error } = updatePostValitation.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!post)
      return res
        .status(404)
        .send({ message: "The post with the given ID was not found" });
    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Somthing went wrong with updating Post !" });
  }
});

//DELETE post
router.delete("/:id", [verifyToken], async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post)
      return res.status(404).send("The post with the given ID was not found");
    res.status(200).send({ message: "post delete", data: post });
  } catch (error) {
    console.log(error);
    res.status(500).send("Somthing went wrong with updating Tag !");
  }
});

export default router;
