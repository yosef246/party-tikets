import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Message from "../components/message";
import styles from "./CardDetails.module.css";
import { Helmet } from "react-helmet-async";
import CardDetailsSkeleton from "../components/Skeleton/CardDetailsSkeleton";

export default function CardDetails() {
  const { id } = useParams();
  const [card, setCard] = useState();
  const [message, setMessage] = useState("");
  const [refId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref");
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [guestEmail, setGuestEmail] = useState(""); //הכנסת המייל למשתמש שלא מחובר למערכת

  // בדיקה האם יש למשתמש שנכנס לפוסט טוקאן
  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/check-auth", {
        credentials: "include",
      });
      if (!res.ok) return;

      const data = await res.json();
      setCurrentUserId(data.user._id);
    }

    checkAuth();
  }, []);

  //ייבוא פוסט אחד לפי האיידי של הפוסט והוספת צפייה באותו פוסט
  useEffect(() => {
    async function fetchCard() {
      try {
        const response = await fetch(
          `/api/post/${id}${refId && refId !== "null" ? `?ref=${refId}` : ""}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "getting failed");
        }

        console.log("post by id:", data);
        setCard(data);
      } catch (error) {
        console.error("Error during getting:", error);
        setMessage(error.message);
      }
    }

    fetchCard();
  }, [id, refId]);

  //פונקציה לתשלום והצגת מספר הרכישות של המשתמש במונגו
  async function handlePurchase(id, ref) {
    if (!currentUserId && !guestEmail) {
      setMessage("אנא הכנס אימייל להפקת קבלה");
      return;
    }

    try {
      const res = await fetch(`/api/post/${id}/purchases/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ref,
          guestEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error purchasing ticket");
      }

      setMessage("רכישה בוצעה בהצלחה נשלחה קבלה למייל!");
      setGuestEmail("");
    } catch (error) {
      console.error("Error during getting:", error);
      setMessage(error.message);
    }
  }

  if (!card) {
    return <CardDetailsSkeleton />;
  }

  return (
    <>
      {/* ✅ SEO דינמי לכל כרטיס */}
      <Helmet>
        <title>{card.title} - Party Tickets</title>
        <meta name="description" content={card.body} />
        <link
          rel="canonical"
          href={`https://party-tikets.onrender.com/card-details/${id}`}
        />
        <meta property="og:title" content={card.title} />
        <meta property="og:description" content={card.body} />
        <meta property="og:image" content={card.imageUrl} />
        <meta
          property="og:url"
          content={`https://party-tikets.onrender.com/card-details/${id}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Party Tickets" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={card.title} />
        <meta name="twitter:description" content={card.body} />
        <meta name="twitter:image" content={card.imageUrl} />
        <meta name="language" content="Hebrew" />

        {/* ✅ Event Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: card.title,
            description: card.body,
            image: card.imageUrl,
            startDate: card.date,
            location: {
              "@type": "Place",
              name: card.location,
            },
            offers: {
              "@type": "Offer",
              price: card.price,
              priceCurrency: "ILS",
              availability: "https://schema.org/InStock",
              url: `https://party-tikets.onrender.com/card-details/${id}`,
            },
            organizer: {
              "@type": "Organization",
              name: "Party Tickets",
              url: "https://party-tikets.onrender.com",
            },
          })}
        </script>
      </Helmet>

      <div className={styles.middle}>
        <div className={styles.cardDetails}>
          <div className={styles.cardImage}>
            <img src={card.imageUrl} alt={card.title} />
          </div>
          <div className={styles.cardContent}>
            <h2>{card.title}</h2>
            <p>
              <strong>📍 מיקום:</strong> {card.location}
            </p>
            <p>
              <strong>מחיר כרטיס:</strong> ₪{card.price}
            </p>
            <p>
              <strong>📅 תאריך:</strong>
              {new Date(card.date).toLocaleDateString("he-IL")}
            </p>
            <p>
              <strong>📝 תיאור:</strong> {card.body}
            </p>

            {/* אם אין לו טוקאן אז אין לו גם מייל ולכן נבקש ממנו כאם מייל לקבלת הרכישה */}
            {!currentUserId && (
              <div>
                <input
                  type="email"
                  className={styles.guestEmailInput}
                  placeholder="הכנס אימייל להפקת קבלה"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>
            )}

            <Message message={message} setMessage={setMessage} />

            <button
              className={styles.cardButton}
              onClick={() => {
                if (!currentUserId) {
                  setMessage("התחבר כדי להעתיק קישור ולהרוויח משיתופים");
                  return;
                }

                navigator.clipboard.writeText(
                  `https://party-tikets.onrender.com/card-details/${id}?ref=${currentUserId}`
                );
                setMessage("קישור הועתק ✔");
              }}
            >
              העתק קישור
            </button>

            <button
              className={styles.cardButton}
              onClick={() =>
                handlePurchase(id, refId && refId !== "null" ? refId : null)
              }
            >
              לחץ לתשלום
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
