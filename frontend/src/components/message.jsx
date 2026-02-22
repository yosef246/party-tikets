import { useEffect } from "react";

export default function Message({ message, setMessage, className }) {
  // ✅ הודעה נעלמת אחרי 3 שניות
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 1500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return <p className={className}>{message}</p>;
}
