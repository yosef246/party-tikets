import { Router } from "express";
import Tag from "../models/tag.js";
import purify from "../../utils/sanitize.js";
import { verifyToken, isAdmin } from "../../utils/token.js";
const router = Router();

router.get("/", async (req, res) => {
  const tag = await Tag.find({});
  res.status(201).send(tag);
});

//POST tag
router.post("/", [verifyToken, isAdmin], async (req, res) => {
  req.body.name = purify.sanitize(req.body.name);
  try {
    const tag = await Tag.create(req.body);
    res.status(200).send(tag);
  } catch (error) {
    console.log(error);
  }
});

//PUT tag
router.put("/:id", [verifyToken, isAdmin], async (req, res) => {
  req.body.name = purify.sanitize(req.body.name);
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!tag)
      return res.status(404).send("The tag with the given ID was not found");
    res.status(200).send(tag);
  } catch (error) {
    console.log(error);
    res.status(500).send("Somthing went wrong with updating Tag !");
  }
});

//DELETE tag
router.delete("/:id", [verifyToken, isAdmin], async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag)
      return res.status(404).send("The tag with the given ID was not found");
    res.status(200).send({ message: "Tag delete", data: tag });
  } catch (error) {
    console.log(error);
    res.status(500).send("Somthing went wrong with updating Tag !");
  }
});

export default router;
