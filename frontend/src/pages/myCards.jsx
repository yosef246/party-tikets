import { useState, useEffect, useContext } from "react";
import styles from "./myCards.module.css";
import { useNavigate } from "react-router-dom";
import MyCardItem from "../components/myCardItem";
import Loader from "../components/Loader";
// import { AuthContext } from "../context/AuthContext";

export default function MyCards() {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [cards, setCards] = useState([]);
  const [refId, setRefId] = useState(null);
  // const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  //בדיקה שיש טוקאן
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check-auth", {
          credentials: "include", // כדי שהשרת יזהה את המשתמש מה-cookie
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();

        setRefId(data.user._id);
      } catch (err) {
        console.log("עליך להתחבר כדי לגשת לדף");
        navigate("/login");
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  //ייבוא כל הכרטיסים של המשתמש בלבד
  useEffect(() => {
    if (loadingAuth) return;

    async function fetchMyPosts() {
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
      } finally {
        setLoadingCards(false);
      }
    }

    fetchMyPosts();
  }, [loadingAuth]);

  // פונקציה שמקבלת id ומסירה אותו מה-state
  function handleDelete(id) {
    setCards((prevCards) => prevCards.filter((card) => card._id !== id));
  }

  if (loadingAuth || loadingCards) {
    return <Loader text="טוען..." />;
  }

  return cards.length > 0 ? (
    <div className={styles.middle}>
      <div className={styles.cardsContainer}>
        {cards.map((card) => (
          <MyCardItem
            id={card._id}
            key={card._id}
            refId={refId}
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
