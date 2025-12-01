import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Pay from "../models/pay.js";
import { verifyToken } from "../../utils/token.js";
import { payValitation } from "../../valitations/pay.js";

const router = Router();

router.post("/topay", [verifyToken], async (req, res) => {
  try {
    //לאחר שהטוקאן ששלחנו עבר אימות אני יכול למשוך ממנו את האיי די כמו בשורה הבאה
    const userId = req.user.id;
    const { name, cardNumber, expiry, cvv } = req.body;

    if (!name || !cardNumber || !expiry || !cvv) {
      return res.status(400).json({ message: "נא למלא את כל השדות" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { hasPaid: true, isAdmin: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    //בדיקת ואלידאציה לפרטי האשראי שעומדים בפרמטרים
    const { error } = payValitation.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    //בודק האם המשתמש שילם כבר לפי האיי די של המשתמש
    const payFind = await Pay.findOne({ author_id: userId });
    if (payFind) return res.status(400).send({ message: "! המשתמש שילם כבר" });

    const salt = await bcrypt.genSalt(10); // יוצר רצף גיבריש
    req.body.cardNumber = await bcrypt.hash(req.body.cardNumber, salt); // מאבטח את המספר כרטיס

    const payment = await Pay.create({ ...req.body, author_id: userId });

    res.status(200).json({
      message: "התשלום בוצע בהצלחה!",
      user: updatedUser,
      pay: payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

router.delete("/deletepay", [verifyToken], async (req, res) => {
  try {
    const userId = req.user.id;

    const removeUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin: false, hasPaid: false },
      { new: true }
    );
    if (!removeUser) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    const removePay = await Pay.findOneAndDelete({ author_id: userId });
    res.status(200).send({ message: "השתלום נמחק", user: removePay });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

export default router;
