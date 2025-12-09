import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./CardDetails.module.css";

export default function CardDetails() {
  const { id } = useParams();
  const refFromUrl = useSearchParams("ref"); // ← לוקחים את מה שב-URL
  const [card, setCard] = useState();
  const [userId, setUserId] = useState("");

  //בדיקה שיש טוקאן
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check-auth", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        setUserId(data.user.username);
        console.log("המשתמש מחובר:", data);
      } catch (err) {
        console.log("עליך להתחבר כדי לגשת לדף");
        setUserId("");
      }
    };

    checkAuth();
  }, []);

  const finalRef = refFromUrl || userId || ""; // תן לי את התנאי הראשון שמתקיים ב - ref

  const link = finalRef
    ? `https://party-tikets.onrender.com/card-details/${id}?ref=${finalRef}`
    : `https://party-tikets.onrender.com/card-details/${id}`;

  //ייבוא פוסט אחד לפי האיידי שלו
  useEffect(() => {
    async function fetchCard() {
      try {
        const response = await fetch(`/api/post/${id}`, {
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
        alert(error.message);
      }
    }

    fetchCard();
  }, [id]);

  if (!card) {
    return <p className={styles.loading}>טוען . . .</p>;
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
            {new Date(card.date).toLocaleDateString()}
          </p>
          <p>
            <strong>📝 תיאור:</strong> {card.body}
          </p>
          <button
            className={styles.cardButton}
            onClick={() => {
              navigator.clipboard.writeText(link);
              alert("קישור הועתק ✔");
            }}
          >
            העתק קישור
          </button>
          {/* <button
            className={styles.cardButton}
            onClick={() => navigate("/payment")}
          >
            לחץ לתשלום
          </button> */}
        </div>
      </div>
    </div>
  );
}
