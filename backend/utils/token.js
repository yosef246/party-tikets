import jwt from "jsonwebtoken";

export const generateToken = ({ id, email, isAdmin, hasPaid }) => {
  //יוצר לי טוקאן חדש
  return jwt.sign(
    {
      id,
      email,
      isAdmin,
      hasPaid,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" } //אומר לי לכמה זמן הטוקאן תקף במקרה הזה ל3 ימים
  );
};

export const verifyToken = (req, res, next) => {
  if (req.headers.cookie) {
    //והשני זה הטוקאן עצמו אז כדי לחלץ רק את הטוקאן access_token כיוון שהטוקאן שלנו מורכב משני חלקים אחד השם שלו שזה
    //אני אומר פה לך לקוקיז ותחלץ לי מאחריי ה= רק את הטוקאן כי זה מה שאני צריך כדי לאמת האם יש למשתמש טוקאן
    // const token = req.headers.cookie.split("=")[1];
    // const token = request.cookies.get("access_token")?.value; //דרך אחרת ויותר בטוחה לאמת האם קיים למשתמש טוקאן
    const token = req.cookies["access_token"]; //עוד דרך לקחת רק את הטוקאן בכדי לבדוק שהוא קיים
    if (!token) return res.status(401).send("Unauthorized");

    //process.env.JWT_SECRET-מאמת לי שהטוקאן שנוצר נוצר מה
    //Payload והוא גם מקבל את כל הפרטים של אותו משתמש כמו האיידי והאימייל כלומר הוא נהיה
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req.user-כיוון שיש לו כבר את כל הפרטים של המשתמש אז אני משווה אותו ל
    console.log("decoded:", decoded);
    return next();
  }
  res.status(401).send("Unauthorized");
};

//בודק האם המשתמש הוא עם טוקאן של אדמין
export const isAdmin = (req, res, next) => {
  if (req.user.isAdmin) return next(); // ואז אתה יכול להמשיךtrue בודק האם האדמין שלו הוא
  res.status(403).send("Access denied"); // במידה ולא ההודעה הזאת תוצג
};
