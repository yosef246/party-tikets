import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./CardDetails.module.css";

export default function CardDetails() {
  const { id } = useParams();
  const [card, setCard] = useState();
  const [stats, setStats] = useState("");
  const { user, loading } = useContext(AuthContext);
  const userId = user?._id;

  //ייבוא פוסט אחד לפי האיידי של הפוסט והוספת צפייה באותו פוסט
  useEffect(() => {
    if (loading) return;
    const refParam = userId ? `?ref=${userId}` : "";

    async function fetchCard() {
      try {
        const response = await fetch(`/api/post/${id}${refParam}`, {
          credentials: "include",
        });

        console.log("userId:", userId);

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
  }, [id, userId, loading]);

  // ייבוא כל הנתונים של המשתמש כמו סהכ עמלות כמות צפיות וכו
  useEffect(() => {
    if (!userId) return;
    async function fetchStats() {
      try {
        const res = await fetch(`/api/post/${userId}/stats`);

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error fetching stats");

        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, [userId, stats]);

  //פונקציה לתשלום והצגת מספר הרכישות של המשתמש במונגו
  async function handlePurchase(id, ref) {
    try {
      const res = await fetch(`/api/post/${id}/purchases`, {
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

      alert("רכישה בוצעה בהצלחה !");
      console.log(data);
    } catch (error) {
      console.error("Error during getting:", error);
      alert(error.message);
    }
  }

  if (!card) {
    return <p className={styles.loading}>טוען . . .</p>;
  }

  return (
    <div className={styles.middle}>
      {stats && (
        <div className={styles.statsFloating}>
          <h3>:הנתונים שקרו דרכיך</h3>
          <p>📈 צפו אצליך: {stats.clickView}</p>
          <p>🎟 כמות שמכרת: {stats.ticketsSold}</p>
          <p>🎟 הרווחת למערכת: {stats.totalRevenue}</p>
          <p>💰 עמלה שצברת: ₪{stats.totalCommission.toFixed(2)}</p>
        </div>
      )}
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
              if (userId) {
                navigator.clipboard.writeText(
                  `https://party-tikets.onrender.com/card-details/${id}?ref=${userId}`
                );
                alert("קישור הועתק ✔");
              } else {
                alert("עליך להתחבר כדי להעתיק את הקישור");
              }
            }}
          >
            העתק קישור
          </button>

          <button
            className={styles.cardButton}
            onClick={() => handlePurchase(id, userId)}
          >
            לחץ לתשלום
          </button>
        </div>
      </div>
    </div>
  );
}
