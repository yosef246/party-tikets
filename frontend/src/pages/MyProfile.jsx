import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./MyProfile.module.css";
import Loader from "../components/Loader";

export default function MyProfile() {
  const [stats, setStats] = useState(null);
  const { user, loading } = useContext(AuthContext);
  const userId = user?._id;

  // ייבוא כל הנתונים של המשתמש כמו סהכ עמלות כמות צפיות וכו
  useEffect(() => {
    if (!userId || loading) return;
    async function fetchStats() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/post/${userId}/stats`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error fetching stats");

        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();

    const interval = setInterval(fetchStats, 1000);
    return () => clearInterval(interval);
  }, [userId, loading]);

  if (loading) {
    return <Loader text="טוען.." />;
  }

  return (
    <div className={styles.middle}>
      {stats && (
        <div className={styles.statsFloating}>
          <h2>סטטיסטיקות המשתמש שלך</h2>

          <p className={styles.statsDescription}>
            כאן תוכל לראות את כל הנתונים החשובים שקשורים לפעילות שלך במערכת.
            מידע זה יעזור לך להבין את הביצועים שלך ולשפר את ההכנסות.
          </p>

          <div className={styles.statsList}>
            <p>📈 צפיות אצלך: {stats.clickView}</p>
            <p>🎟 כמות כרטיסים שנמכרו: {stats.ticketsSold}</p>
            <p>💸 הרווח של המערכת: ₪{stats.totalRevenue}</p>
            <p>💰 עמלה שצברת: ₪{stats.totalCommission.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
