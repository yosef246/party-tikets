import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./header.module.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTrue, setIsTrue] = useState(false);

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
        setIsTrue(true);
        alert("המשתמש מחובר");
      } catch (err) {
        setIsTrue(false);
        console.log("עליך להתחבר כדי לגשת לדף");
      }
    };

    checkAuth();
  }, []);

  return (
    <header className={styles.header}>
      <Link className={styles.icon} to="/">
        PARTY TIKETS
      </Link>
      <div className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      <nav className={styles.desktopNav}>
        <ul className={styles.navList}>
          <li>
            <Link className={styles.navLink} to="/about">
              עלינו
            </Link>
          </li>
          <li>
            <Link className={styles.navLink} to="/contact">
              צרו קשר
            </Link>
          </li>

          {isTrue ? (
            <li>
              <Link className={styles.navLink} to="/party-cards">
                עריכה
              </Link>
            </li>
          ) : (
            <li>
              <Link className={styles.navLink} to="/register">
                הרשמה
              </Link>
            </li>
          )}

          <li>
            <Link className={styles.signup} to="/login">
              התחברות
            </Link>
          </li>
        </ul>
      </nav>

      {/* תפריט מובייל בבועה */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>
          בית
        </Link>
        <Link to="/about" onClick={() => setIsOpen(false)}>
          עלינו
        </Link>
        <Link to="/contact" onClick={() => setIsOpen(false)}>
          צרו קשר
        </Link>

        {isTrue ? (
          <Link to="/party-cards" onClick={() => setIsOpen(false)}>
            עריכה
          </Link>
        ) : (
          <Link to="/register" onClick={() => setIsOpen(false)}>
            הרשמה
          </Link>
        )}

        <Link to="/login" onClick={() => setIsOpen(false)}>
          התחברות
        </Link>
      </div>
    </header>
  );
}

export default Header;
