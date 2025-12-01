import mongoose from "mongoose";

const paySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  cardNumber: {
    type: String,
    required: true,
    minlength: 13,
    maxlength: 255,
  },
  expiry: {
    type: String,
    required: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId, //מסוג אובייקט
    ref: "User", //איזה אובייקט ? של יוזר
  },
});

const Pay = mongoose.model("Pay", paySchema);

export default Pay;
