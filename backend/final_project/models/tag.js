import mongoose from "mongoose";

const tagsShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
});

const Tag = mongoose.model("Tag", tagsShema);

export default Tag;
