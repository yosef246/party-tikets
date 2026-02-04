import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./MyProfile.module.css";
import Loader from "../components/Loader";

export default function MyProfile() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsloading] = useState(true);
  const { user, loading, isAuthenticated } = useContext(AuthContext);
  const userId = user?._id;
  const navigate = useNavigate();

  //בדיקה שיש טוקאן דרך USECONTEXT
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // ייבוא כל הנתונים של המשתמש כמו סהכ עמלות כמות צפיות וכו
  useEffect(() => {
    if (loading) return;
    // if (!isAuthenticated || !user) return;

    let isMounted = true;

    async function fetchStats() {
      setStatsloading(true);
      try {
        const res = await fetch(`/api/post/${userId}/stats`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error fetching stats");

        if (isMounted) {
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        if (isMounted) setStatsloading(false);
      } finally {
        if (isMounted) {
          setStatsloading(false);
        }
      }
    }
    fetchStats();

    // const interval = setInterval(fetchStats, 5000);
    // return () => {
    //   isMounted = false;
    //   clearInterval(interval);
    // };
  }, [loading]);

  if (loading || statsLoading) {
    return <Loader text="טוען.." />;
  }

  return (
    <div className={styles.middle}>
      <div className={styles.statsFloating}>
        <h1>{stats.nameOfUser} שלום</h1>
        <h2>סטטיסטיקות המשתמש שלך</h2>

        <p className={styles.statsDescription}>
          כאן תוכל לראות את כל הנתונים החשובים שקשורים לפעילות שלך במערכת. מידע
          זה יעזור לך להבין את הביצועים שלך ולשפר את ההכנסות.
        </p>

        <div className={styles.statsList}>
          <p>📈 צפיות אצלך: {stats.clickView}</p>
          <p>🎟 כמות כרטיסים שנמכרו: {stats.ticketsSold}</p>
          <p>💸 הרווח של המערכת: ₪{stats.totalRevenue}</p>
          <p>💰 עמלה שצברת: ₪{stats.totalCommission.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
