import purify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = purify(window);

/**
 * פונקציה לניקוי req.body מקוד זדוני
 * @param {Object} req - request object
 * @returns {Object|null} - null אם הכל בסדר, או אובייקט שגיאה אם נמצא קוד זדוני
 */
function sanitizeBody(req) {
  let hasXSS = false;

  Object.keys(req.body).forEach((key) => {
    if (Array.isArray(req.body[key])) {
      // אם זה מערך - נקה כל איבר
      req.body[key] = req.body[key].map((item) => {
        if (typeof item === "string") {
          const cleaned = DOMPurify.sanitize(item);
          // אם הטקסט השתנה אחרי הניקוי - זה אומר שהיה קוד זדוני
          if (cleaned !== item) hasXSS = true;
          return cleaned;
        }
        return item;
      });
    } else if (typeof req.body[key] === "string") {
      // אם זה string - נקה אותו
      const original = req.body[key];
      const cleaned = DOMPurify.sanitize(original);

      // אם הטקסט השתנה אחרי הניקוי - זה אומר שהיה קוד זדוני
      if (cleaned !== original) hasXSS = true;

      req.body[key] = cleaned;
    }
  });

  // אם נמצא קוד זדוני - החזר הודעת שגיאה
  if (hasXSS) {
    return {
      error: true,
      message: "נמצא תוכן חשוד בבקשה. הנתונים נוקו אוטומטית.",
      statusCode: 400,
    };
  }

  return null; // הכל בסדר
}

export default sanitizeBody;
