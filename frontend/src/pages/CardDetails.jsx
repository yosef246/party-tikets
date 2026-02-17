import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./CardDetails.module.css";
import Loader from "../components/Loader";

export default function CardDetails() {
  const { id } = useParams();
  const [card, setCard] = useState();
  const [message, setMessage] = useState("");
  const [refId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref");
  });
  const [currentUserId, setCurrentUserId] = useState(null);

  // ✅ הודעה נעלמת אחרי 3 שניות
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 1500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // בדיקה האם יש למשתמש שנכנס לפוסט טוקאן
  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/check-auth", {
        credentials: "include",
      });
      if (!res.ok) return;

      const data = await res.json();
      setCurrentUserId(data.user._id);
    }

    checkAuth();
  }, []);

  //ייבוא פוסט אחד לפי האיידי של הפוסט והוספת צפייה באותו פוסט
  useEffect(() => {
    async function fetchCard() {
      try {
        const response = await fetch(`/api/post/${id}?ref=${refId}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "getting failed");
        }

        console.log("post by id:", data);
        setCard(data);
      } catch (error) {
        console.error("Error during getting:", error);
        setMessage(error.message);
      }
    }

    fetchCard();
  }, [id, refId]);

  //פונקציה לתשלום והצגת מספר הרכישות של המשתמש במונגו
  async function handlePurchase(id, ref) {
    try {
      const res = await fetch(`/api/post/${id}/purchases/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ref,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error purchasing ticket");
      }

      setMessage("רכישה בוצעה בהצלחה !");
      console.log(data);
    } catch (error) {
      console.error("Error during getting:", error);
      setMessage(error.message);
    }
  }

  if (!card) {
    return <Loader text="טוען..." />;
  }

  return (
    <div className={styles.middle}>
      <div className={styles.cardDetails}>
        <div className={styles.cardImage}>
          <img src={card.imageUrl} alt={card.title} />
        </div>
        <div className={styles.cardContent}>
          <h2>{card.title}</h2>
          <p>
            <strong>📍 מיקום:</strong> {card.location}
          </p>
          <p>
            <strong>מחיר כרטיס:</strong> ₪{card.price}
          </p>
          <p>
            <strong>📅 תאריך:</strong>
            {new Date(card.date).toLocaleDateString("he-IL")}
          </p>
          <p>
            <strong>📝 תיאור:</strong> {card.body}
          </p>

          {message && <p className={styles.message}>{message}</p>}

          <button
            className={styles.cardButton}
            onClick={() => {
              if (!currentUserId) {
                setMessage("התחבר כדי להעתיק קישור ולהרוויח משיתופים");
                return;
              }

              navigator.clipboard.writeText(
                `https://party-tikets.onrender.com/card-details/${id}?ref=${currentUserId}`
              );
              setMessage("קישור הועתק ✔");
            }}
          >
            העתק קישור
          </button>

          <button
            className={styles.cardButton}
            onClick={() => handlePurchase(id, refId)}
          >
            לחץ לתשלום
          </button>
        </div>
      </div>
    </div>
  );
}
