import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tags: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tag",
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
