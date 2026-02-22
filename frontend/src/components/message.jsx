import { useEffect } from "react";
import styles from ".message.module.css";

export default function Message({ message, setMessage }) {
  // ✅ הודעה נעלמת אחרי 3 שניות
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 1500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return <p className={styles.message}>{message}</p>;
}
