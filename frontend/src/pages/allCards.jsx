import { useState, useEffect } from "react";
import styles from "./allCards.module.css";
import { useNavigate } from "react-router-dom";
import CardItem from "../components/cardItem";

export default function AllCards() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); //  מצב בדיקה
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

        if (!data.user.hasPaid) {
          alert("אין לך הרשאות , עליך לשלם בכדי להמשיך לדף הבא");
          navigate("/party-cards");
          return;
        }

        console.log("המשתמש מחובר:", data);
      } catch (err) {
        console.log("עליך להתחבר כדי לגשת לדף");
        navigate("/login");
      } finally {
        setIsCheckingAuth(false); // הבדיקה הסתיימה
      }
    };

    checkAuth();
  }, [navigate]);

  //ייבוא כל הכרטיסים שקיימים במערכת
  useEffect(() => {
    if (isCheckingAuth) return; // אם הבדיקה עדיין רצה כלומר טרו אל תפעיל את הפונקציה הנ"ל

    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch("/api/post/");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "upload failed");
        }

        // console.log("כל הכרטיסים", data);
        setCards(data);
      } catch (err) {
        console.log("ייבוא הכרטיסים נכשל", err);
      }
      setLoading(false);
    }
    fetchData();
  }, [isCheckingAuth]);

  if (loading) {
    return <p className={styles.loading}>. . . טוען</p>;
  }
  if (isCheckingAuth) {
    return <p className={styles.loading}>. . . בודק הרשאות</p>;
  }

  return cards.length > 0 ? (
    <div className={styles.middle}>
      <div className={styles.cardsContainer}>
        {cards.map((card) => (
          <CardItem
            id={card._id}
            key={card._id}
            title={card.title}
            location={card.location}
            date={card.date}
            body={card.body}
            imageUrl={card.imageUrl}
          />
        ))}
      </div>
    </div>
  ) : (
    <p className={styles.loading}>No cards available</p>
  );
}
