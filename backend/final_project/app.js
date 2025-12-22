import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import newUserRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import tagRouter from "./routes/tag.js";
import paymentRouter from "./routes/payment.js";

import connectToMongoDB from "../utils/conectDB.js";

const app = express();

// const port = 3003;
const port = process.env.PORT || 3001;

//env מאפשר לי להשתמש בערכים שנמצאים בקובץ
dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://party-tikets.onrender.com"],
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

// לוקח את הנתיב לקובץ הנוכחי שזה app.js ומכניס אותו לקובץ
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// בונה נתיב יחסי מהתקייה הזאת לתיקיית הבילד
app.use(express.static(path.join(__dirname, "../../frontend/build")));

// כל בקשה שלא מובילה לקובץ סטטי עוברת ל-index.html
//  וה-react-routers יודע לפי ה-url איזה דף להציג
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example run on port ${port}!`);
});

export default app;
