import styles from "./createPartyCard.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function CreatePartyCardPage({ handleHeader }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

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
        handleHeader(true);
      } catch (err) {
        console.log("עליך להתחבר כדי לגשת לדף");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, handleHeader]);

  async function handleSubmit(e) {
    e.preventDefault(); //נועד למנוע את הרענון של הדף כאשר טופס נשלח אוטומטית
    setLoading(true);
    try {
      const response = await fetch("/api/post/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", //שולח קוקיז לשרת בשביל האימות
        body: JSON.stringify({ title, location, date, body, imageUrl }),
      });

      const data = await response.json(); //מחזירה את התגובה מהשרת

      if (!response.ok) {
        throw new Error(data.message || "upload failed");
      }

      console.log("upload successful:", data);
      alert("הכרטיס נוצר בהצלחה!");
      setTitle("");
      setLocation("");
      setDate("");
      setBody("");
      setImageUrl("");
    } catch (error) {
      console.error("Error during logined:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "שגיאה בהתנתקות");
      } else {
        alert(data.message);
        handleHeader(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("שגיאה בלוגאאוט:", error);
      alert("משהו השתבש");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.middle}>
      <div className={styles.menucontainer}>
        <div className={`${styles.submenu} ${open ? styles.open : ""}`}>
          <button>
            <Link className={styles.signup} to="/all-cards">
              כל הכרטיסים
            </Link>
          </button>
          <button>
            <Link className={styles.signup} to="/my-cards">
              הכרטיסים שלך
            </Link>
          </button>
          <button>
            <Link className={styles.signup} to="/payment">
              שלם עכשיו
            </Link>
          </button>
        </div>
        <button className={styles.mainbutton} onClick={() => setOpen(!open)}>
          M
        </button>
      </div>

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

          <button type="submit">{loading ? "שולח.." : "צור כרטיס"}</button>
          <button onClick={handleLogout}>
            {loading ? "מתנתק.." : "התנתקות"}
          </button>
        </form>
      </div>
    </div>
  );
}
