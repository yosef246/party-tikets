import { useState, useEffect, useContext } from "react";
import styles from "./allCards.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CardItem from "../components/cardItem";
import Loader from "../components/Loader";

export default function AllCards() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); //  מצב בדיקה
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  //בדיקה שיש טוקאן
  useEffect(() => {
    if (isAuthenticated === null || !user) return;
    if (!isAuthenticated) {
      console.log("עליך להתחבר כדי לגשת לדף");
      navigate("/login");
      setIsCheckingAuth(false);
      return;
    }

    if (!user.hasPaid) {
      alert("אין לך הרשאות , עליך לשלם בכדי להמשיך לדף הבא");
      navigate("/party-cards");
      setIsCheckingAuth(false);
      return;
    }

    console.log("המשתמש מחובר:", user);
    setIsCheckingAuth(false); // הבדיקה הסתיימה
  }, [isAuthenticated, user, navigate]);

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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isCheckingAuth]);

  if (loading) {
    return <Loader text="טוען..." />;
  }
  if (isCheckingAuth) {
    return <Loader text="בודק הרשאות..." />;
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
            price={card.price}
            date={card.date}
            body={card.body}
            imageUrl={card.imageUrl}
          />
        ))}
      </div>
    </div>
  ) : (
    <p className={styles.loading}>לא נמצאו כרטיסים</p>
  );
}
