import styles from "./contact.module.css";
import { Helmet } from "react-helmet-async";

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>צרו קשר - Party Tickets</title>
        <meta
          name="description"
          content="צרו איתנו קשר בכל שאלה על כרטיסים למסיבות, שיתופי פעולה או עמלות. נשמח לעזור!"
        />
        <link
          rel="canonical"
          href="https://party-tikets.onrender.com/contact"
        />
        <meta property="og:title" content="צרו קשר - Party Tickets" />
        <meta
          property="og:description"
          content="צרו איתנו קשר בכל שאלה על כרטיסים למסיבות ושיתופי פעולה."
        />
        <meta
          property="og:url"
          content="https://party-tikets.onrender.com/contact"
        />
        <meta property="og:type" content="website" />

        {/* ✅ ContactPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "צרו קשר - Party Tickets",
            url: "https://party-tikets.onrender.com/contact",
            description: "דף יצירת קשר של Party Tickets",
            contactOption: {
              "@type": "ContactPoint",
              telephone: "050-123-4567",
              email: "support@yourpartysite.co.il",
              contactType: "customer support",
              hoursAvailable: "Mo-Fr 09:00-18:00",
              availableLanguage: "Hebrew",
            },
          })}
        </script>

        {/* ✅ FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "איך אפשר ליצור קשר עם Party Tickets?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "ניתן לפנות במייל support@yourpartysite.co.il או בטלפון 050-123-4567 בימים א'-ה' בין 9:00-18:00.",
                },
              },
              {
                "@type": "Question",
                name: "האם אפשר לשתף פעולה עם Party Tickets?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "כן! בעלי מועדונים ומפיקי מסיבות מוזמנים לפנות אלינו לשיתופי פעולה.",
                },
              },
            ],
          })}
        </script>
      </Helmet>

      <div className={styles.middle}>
        <h1>נשמח לשמוע ממך</h1>

        <section className={styles.section1}>
          <h2>? יש לך שאלה</h2>
          <p>
            אנחנו כאן כדי לעזור! בין אם אתה יחצן מתחיל, שותף פוטנציאלי או פשוט
            סקרן לדעת עוד – נשמח לתת מענה.
          </p>
        </section>

        <hr className={styles.sectiondivider} />

        <section className={styles.section2}>
          <h2>? איך אפשר לפנות אלינו</h2>
          <p>
            הדרך המהירה ביותר היא דרך הצ'אט שלנו — זמין 24/7 בפינה הימנית
            התחתונה של המסך 💬
          </p>
        </section>

        <hr className={styles.sectiondivider} />

        <section className={styles.section3}>
          <h2>? רוצה לשתף אותנו</h2>
          <p>
            אם אתה בעל מועדון, מפיק מסיבות, או יש לך רעיון יצירתי לשיתוף פעולה –
            דבר איתנו דרך הצ'אט ונשמח לשמוע.
          </p>
        </section>

        <hr className={styles.sectiondivider} />
      </div>
    </>
  );
}
