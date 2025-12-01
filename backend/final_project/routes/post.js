import { Router } from "express";
import Post from "../models/post.js";
import Tag from "../models/tag.js";
import purify from "../../utils/sanitize.js";
import {
  createPostValitation,
  updatePostValitation,
} from "../../valitations/post.js";
import { isAdmin, verifyToken } from "../../utils/token.js";

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
router.get("/:id", [verifyToken], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Somthing went wrong with getting post" });
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
  if (error) return res.status(400).send(error.details[0].message);

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
  if (error) return res.status(400).send(error.details[0].message);

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
router.delete("/:id", [verifyToken, isAdmin], async (req, res) => {
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
