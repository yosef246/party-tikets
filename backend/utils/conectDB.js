import mongoose from "mongoose";

const connectToMongoDB = () => {
  mongoose
    .connect(process.env.CONECT_TO_MONGODB)
    .then(() => console.log("Connect to MongoDB..."))
    .catch((err) => console.error("Could not Connect to MongoDB..."));
};
export default connectToMongoDB;
