import styles from "./createPartyCard.module.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../components/message";
import { Link } from "react-router-dom";
import Looader from "../components/Loader";
import { Tickets, User, CreditCard, Menu, X, Loader } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function CreatePartyCardPage() {
  const [message, setMessage] = useState("");
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loadingCard, setLoadingCard] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  //בדיקה שיש טוקאן דרך USECONTEXT
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault(); //נועד למנוע את הרענון של הדף כאשר טופס נשלח אוטומטית
    setLoadingCard(true);
    try {
      const response = await fetch("/api/post/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", //שולח קוקיז לשרת בשביל האימות
        body: JSON.stringify({ title, location, price, date, body, imageUrl }),
      });

      const data = await response.json(); //מחזירה את התגובה מהשרת

      if (!response.ok) {
        throw new Error(data.message || "upload failed");
      }

      console.log("upload successful:", data);
      setMessage("הכרטיס נוצר בהצלחה!");
      setTitle("");
      setLocation("");
      setDate("");
      setPrice("");
      setBody("");
      setImageUrl("");
    } catch (error) {
      console.error("Error during logined:", error);
      setMessage(error.message);
    } finally {
      setLoadingCard(false);
    }
  }

  if (loading) {
    return <Looader text="טוען" />;
  }

  return (
    <div className={styles.middle}>
      <h1>ברוכים הבאים למועדון היחצנים</h1>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>צור כרטיס למסיבה שלך</h2>
          <p>
            חמישה שלבים פשוטים: תן שם למסיבה, בחר מיקום ותאריך, וצרף תיאור
            ותמונה שתגנוב את ההצגה 🎉
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="שם המסיבה"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="מיקום המסיבה"
            required
          />
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="מחיר כרטיס"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <textarea
            className={styles.textarea}
            placeholder="תיאור קצר של המסיבה (מה מחכה למוזמנים 🎶🍸)"
            minLength={3}
            maxLength={200}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="קישור לתמונה"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Message message={message} setMessage={setMessage} />
          <button type="submit">{loadingCard ? "שולח.." : "צור כרטיס"}</button>
        </form>
      </div>

      <div className={styles.menu}>
        <div className={`${styles.toggle} ${open ? styles.open : ""}`}>
          <button>
            <Link className={styles.signup} to="/all-cards">
              <Tickets size={20} />
              {/* <span>כל הכרטיסים</span> */}
            </Link>
          </button>
          <button>
            <Link className={styles.signup} to="/my-cards">
              <User size={20} />
              {/* <span>הכרטיסים שלך</span> */}
            </Link>
          </button>
          <button>
            <Link className={styles.signup} to="/payment">
              <CreditCard size={20} />
              {/* <span>שלם עכשיו</span> */}
            </Link>
          </button>
        </div>

        <button
          className={`${styles.mainbutton} ${open ? styles.active : ""}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </div>
  );
}
