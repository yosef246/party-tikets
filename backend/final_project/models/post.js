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
  price: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 3,
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

//////////////////////////////
// מודול Click (צפיות)
//////////////////////////////
const clickSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  referrer_username: {
    type: String,
    required: true,
  },
  visitor_id: {
    type: String,
    required: true,
  },
  clickedAt: {
    type: Date,
    default: Date.now,
  },
});

const ClickView = mongoose.model("ClickView", clickSchema);

//////////////////////////////
// מודול Purchase (רכישות)
//////////////////////////////
const purchaseSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  referrer_username: {
    type: String,
    required: true,
  },
  Purchaser_id: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
});

const Purchases = mongoose.model("Purchase", purchaseSchema);

export { Post, ClickView, Purchases };
