import { Link } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import { Info, Mail, Edit, User, LogOut, UserPlus, LogIn } from "lucide-react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, loading, setIsAuthenticated } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return null;

  async function handleLogout() {
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
        setIsAuthenticated(false);
        navigate("/login");
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <header className={styles.header}>
      <Link className={styles.icon} to="/">
        PARTY TIKETS
      </Link>
      <div
        ref={hamburgerRef}
        className={`${styles.hamburger} ${isOpen ? styles.rotate : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
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
                <Link className={styles.navLink} to="/profile">
                  פרופיל אישי
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={styles.signup}
                >
                  התנתקות
                </button>
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

      {/* תפריט מובייל בבועה עם אייקונים */}
      <div
        ref={menuRef}
        className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}
      >
        <Link
          to="/about"
          onClick={() => setIsOpen(false)}
          className={styles.menuItem}
        >
          <Info size={24} />
        </Link>
        <Link
          to="/contact"
          onClick={() => setIsOpen(false)}
          className={styles.menuItem}
        >
          <Mail size={24} />
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/party-cards"
              onClick={() => setIsOpen(false)}
              className={styles.menuItem}
            >
              <Edit size={24} />
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className={styles.menuItem}
            >
              <User size={24} />
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className={`${styles.navLink} ${styles.menuItem}`}
            >
              <LogOut size={24} />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className={styles.menuItem}
            >
              <UserPlus size={24} />
            </Link>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className={styles.menuItem}
            >
              <LogIn size={24} />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
