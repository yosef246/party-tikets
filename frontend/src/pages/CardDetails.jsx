import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./CardDetails.module.css";
import Loader from "../components/Loader";

export default function CardDetails() {
  const { id } = useParams();
  const [card, setCard] = useState();
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const [refId, setRefId] = useState(null);

  useEffect(() => {
    //פה אני שומר את הרף של המשתמש הנוכחי ששלח את הכרטיס
    if (!refId) {
      const searchParams = new URLSearchParams(window.location.search);
      setRefId(searchParams.get("ref") || userId);
    }
  }, [user, refId]);

  //ייבוא פוסט אחד לפי האיידי של הפוסט והוספת צפייה באותו פוסט
  useEffect(() => {
    if (!refId) return;
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
        alert(error.message);
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

      alert("רכישה בוצעה בהצלחה !");
      console.log(data);
    } catch (error) {
      console.error("Error during getting:", error);
      alert(error.message);
    }
  }

  if (!card || !refId) {
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
                alert("התחבר כדי להעתיק את הקישור ולהרוויח משיתופים");
              }
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
