import styles from "./login.module.css";
import { useState, useContext } from "react";
import Message from "../components/message";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // מונע רענון דף
    setLoading(true);

    try {
      const response = await fetch("api/auth/login", {
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
      setMessage("התחברת בהצלחה !");
      setEmail("");
      setPassword("");
      setIsAuthenticated(true);
      setTimeout(() => navigate("/party-cards"), 1500); // ✅ מחכה שההודעה תוצג
    } catch (error) {
      console.error("Error during logined:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loader text="עוד רגע ונכנסים..." />;
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
        <Message
          message={message}
          setMessage={setMessage}
          className={styles.message}
        />
      </div>
    </div>
  );
}
