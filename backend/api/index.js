import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";

import newUserRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import tagRouter from "./routes/tag.js";
import paymentRouter from "./routes/payment.js";

import connectToMongoDB from "./utils/conectDB.js";

const app = express();
// const port = 3003;
const port = process.env.PORT || 3000;

//env מאפשר לי להשתמש בערכים שנמצאים בקובץ
dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://party-cards-with-react-node-js.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Cookie",
      "Set-Cookie",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

//middleware - לייבוא המידע שנכנס
app.use(express.json());

//מפרש את הקוקיז שמגיע מהלקוח
app.use(cookieParser());

//מתחבר למונגו שלי
connectToMongoDB();

app.use("/api/auth", newUserRouter);
app.use("/api/post", postRouter);
app.use("/api/tag", tagRouter);
app.use("/api/payment", paymentRouter);

// app.listen(port, "0.0.0.0", () => {
//   console.log(`Example run on port ${port}!`);
// });

// export default app;

export const handler = serverless(app);
