import styles from "./login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // מונע רענון דף
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", //שולח קוקיז לשרת בשביל האימות
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json(); //מחזירה את התגובה מהשרת

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful:", data);
      // alert("נכנסת בהצלחה!");
      setEmail("");
      setPassword("");
      navigate("/party-cards");
    } catch (error) {
      console.error("Error during logined:", error);
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
          <h2 className={styles.title}>היי Publicists</h2>
          <p>התחברו לחשבון שלכם כדי לקבל גישה מלאה.</p>
        </div>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="אימייל"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="סיסמא"
            required
          />
          <Link className={styles.forgotPassword} to="/">
            שכחת סיסמה?
          </Link>
          <button type="submit">התחברות</button>
          <p>עדיין אין לך חשבון ?</p>
          <Link className={styles.signup} to="/register">
            הרשמה עכשיו
          </Link>
        </form>
      </div>
    </div>
  );
}
