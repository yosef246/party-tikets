import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./header.module.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

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

          {isAuthenticated ? (
            <>
              <li>
                <Link className={styles.navLink} to="/party-cards">
                  עריכה
                </Link>
              </li>
              <li>
                <Link className={styles.signup} to="/profile">
                  פרופיל אישי
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className={styles.navLink} to="/register">
                  הרשמה
                </Link>
              </li>
              <li>
                <Link className={styles.signup} to="/login">
                  התחברות
                </Link>
              </li>
            </>
          )}
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

        {isAuthenticated ? (
          <>
            <Link to="/profile" onClick={() => setIsOpen(false)}>
              פרופיל אישי
            </Link>
            <Link to="/party-cards" onClick={() => setIsOpen(false)}>
              עריכה
            </Link>
          </>
        ) : (
          <>
            <Link to="/register" onClick={() => setIsOpen(false)}>
              הרשמה
            </Link>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              התחברות
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
