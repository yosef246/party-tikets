import { useState, useEffect, useContext } from "react";
import styles from "./myCards.module.css";
import { useNavigate } from "react-router-dom";
import MyCardItem from "../components/myCardItem";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";

export default function MyCards() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  //בדיקה שיש טוקאן דרך USECONTEXT
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  //ייבוא כל הכרטיסים של המשתמש בלבד
  useEffect(() => {
    if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

  // פונקציה שמקבלת id ומסירה אותו מה-state
  function handleDelete(id) {
    setCards((prevCards) => prevCards.filter((card) => card._id !== id));
  }

  if (loading) {
    return <Loader text="טוען..." />;
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
            price={card.price}
            date={card.date}
            body={card.body}
            imageUrl={card.imageUrl}
            onDelete={() => handleDelete(card._id)} // מעבירים פונקציה שמוחקת מה-state
          />
        ))}
      </div>
    </div>
  ) : (
    <p className={styles.loading}>לא נמצאו כרטיסים</p>
  );
}
