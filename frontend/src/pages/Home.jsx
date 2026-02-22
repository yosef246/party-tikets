import styles from "./home.module.css";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function HomePage() {
  return (
    <>
      {/* ✅ SEO דינמי */}
      <Helmet>
        <title>Party Tickets - כרטיסים למסיבות הכי שוות בישראל</title>
        <meta
          name="description"
          content="הצטרף עכשיו והרוויח עמלה על כל כרטיס שנמכר! שתף קישורים לאירועים - ללא ניסיון, ללא ראיונות. מערכת שקופה למעקב אחרי ההכנסות."
        />
        <meta
          name="keywords"
          content="מסיבות, כרטיסים, אירועים, בילויים, party, tickets, events, הרווחה מסיבות, שיווק שותפים"
        />
        <link rel="canonical" href="https://party-tikets.onrender.com/" />

        {/* Open Graph */}
        <meta property="og:title" content="Party Tickets - הרוויח ממסיבות" />
        <meta
          property="og:description"
          content="שתף קישורים לאירועים והרווח עמלה על כל כרטיס שנמכר!"
        />
        <meta property="og:url" content="https://party-tikets.onrender.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="he_IL" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Party Tickets - הרוויח ממסיבות" />
        <meta
          name="twitter:description"
          content="שתף קישורים לאירועים והרווח עמלה!"
        />
      </Helmet>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1>הדרך שלך להרוויח ממסיבות מתחילה כאן</h1>
          <p>
            שתף קישורים לאירועים, הרווח עמלה על כל כרטיס שנמכר — בלי ניסיון, בלי
            ראיונות.
          </p>
          <Link to="/register" className={styles.cta}>
            היכנס עכשיו
          </Link>
        </section>

        {/* How It Works */}
        <section className={styles.steps}>
          <h2>איך זה עובד?</h2>
          <div className={styles.stepList}>
            <div className={styles.step}>נרשמים</div>
            <div className={styles.step}>בוחרים מסיבה</div>
            <div className={styles.step}>משתפים קישור אישי</div>
            <div className={styles.step}>מרוויחים עמלה</div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className={styles.whyUs}>
          <h2>למה להצטרף אלינו?</h2>
          <ul>
            <li>פתוח לכולם – לא משנה איפה גרים או בני כמה</li>
            <li>ללא ראיון או ניסיון</li>
            <li>עמלות אמיתיות על כל מכירה</li>
            <li>מערכת שקופה למעקב אחרי ההכנסות</li>
            <li>תשלום בהעברה בנקאית</li>
          </ul>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <Link to="/register" className={styles.ctaLarge}>
            רוצה להתחיל ? הירשם עכשיו!
          </Link>
        </section>
      </div>
    </>
  );
}
