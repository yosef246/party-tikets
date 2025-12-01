import { useState } from "react";
import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import sendWelcomeEmail from "../components/emailjsRegister";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // מונע רענון דף
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", //שולח קוקיז לשרת בשביל האימות
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json(); //מחזירה את התגובה מהשרת

      if (!response.ok) {
        throw new Error(data.message || "Registered failed");
      }

      console.log("Registration successful:", data);
      alert("נרשמת בהצלחה!");
      setName("");
      setEmail("");
      setPassword("");
      navigate("/party-cards");
      sendWelcomeEmail(name, email); // שליחת מייל לאחר הירשמות
    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        ...עוד רגע ונכנסים
      </div>
    );
  }

  return (
    <div className={styles.middle}>
      <div className={styles.formContainer}>
        <div className={styles.divContainer}>
          <h2 className={styles.title}>שלום Publicists</h2>
          <p>הירשמו עכשיו בכדי ליצור גישה מלאה למערכת.</p>
        </div>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="שם משתמש"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="סיסמא"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">הרשמה</button>
          <p>יש לך כבר חשבון ?</p>
          <Link className={styles.signup} to="/login">
            התחברות עכשיו
          </Link>
        </form>
      </div>
    </div>
  );
}
