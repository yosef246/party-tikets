import { useState, useEffect } from "react";
import styles from "./allCards.module.css";
import { useNavigate } from "react-router-dom";
import MyCardItem from "../components/myCardItem";

export default function MyCards() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

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
        console.log("המשתמש מחובר:", data);
      } catch (err) {
        console.log("עליך להתחבר כדי לגשת לדף");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  //ייבוא כל הכרטיסים של המשתמש בלבד
  useEffect(() => {
    async function fetchMyPosts() {
      setLoading(true);
      try {
        const response = await fetch("/api/post/my-cards", {
          credentials: "include", // כדי לשלוח את הקוקי עם הטוקן
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "upload failed");
        } else {
          console.log("כל הכרטיסים", data);
          setCards(data);
        }
      } catch (err) {
        console.error("שגיאה בהבאת הפוסטים של המשתמש:", err);
      }
      setLoading(false);
    }

    fetchMyPosts();
  }, []);

  // פונקציה שמקבלת id ומסירה אותו מה-state
  function handleDelete(id) {
    setCards((prevCards) => prevCards.filter((card) => card._id !== id));
  }

  if (loading) {
    return <p className={styles.loading}>טוען . . .</p>;
  }

  return cards.length > 0 ? (
    <div className={styles.middle}>
      <div className={styles.cardsContainer}>
        {cards.map((card) => (
          <MyCardItem
            id={card._id}
            key={card._id}
            title={card.title}
            location={card.location}
            date={card.date}
            body={card.body}
            imageUrl={card.imageUrl}
            onDelete={() => handleDelete(card._id)} // מעבירים פונקציה שמוחקת מה-state
          />
        ))}
      </div>
    </div>
  ) : (
    <p className={styles.loading}>No cards available</p>
  );
}
