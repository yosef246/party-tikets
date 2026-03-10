import { useEffect } from "react";
import styles from "./message.module.css";

export default function Message({ message, setMessage, setLoading }) {
  // ✅ הודעה נעלמת אחרי 1.5 שניות
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 1500);
      if (setLoading) setLoading(false); // קיים ספציפית בדף התשלום payment
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return <p className={styles.message}>{message}</p>;
}
