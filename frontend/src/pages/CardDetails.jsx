import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Message from "../components/message";
import styles from "./CardDetails.module.css";
import Loader from "../components/Loader";
import { Helmet } from "react-helmet-async";

export default function CardDetails() {
  const { id } = useParams();
  const [card, setCard] = useState();
  const [message, setMessage] = useState("");
  const [refId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref");
  });
  const [currentUserId, setCurrentUserId] = useState(null);

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
        const response = await fetch(`/api/post/${id}?ref=${refId}`, {
          credentials: "include",
        });

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
    try {
      const res = await fetch(`/api/post/${id}/purchases/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ref,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error purchasing ticket");
      }

      setMessage("רכישה בוצעה בהצלחה !");
      console.log(data);
    } catch (error) {
      console.error("Error during getting:", error);
      setMessage(error.message);
    }
  }

  if (!card) {
    return <Loader text="טוען..." />;
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

        {/* Open Graph דינמי */}
        <meta property="og:title" content={card.title} />
        <meta property="og:description" content={card.body} />
        <meta property="og:image" content={card.imageUrl} />
        <meta
          property="og:url"
          content={`https://party-tikets.onrender.com/card-details/${id}`}
        />
        <meta property="og:type" content="article" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={card.title} />
        <meta name="twitter:description" content={card.body} />
        <meta name="twitter:image" content={card.imageUrl} />

        {/* ✅ Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: card.title,
            description: card.body,
            image: card.imageUrl,
            location: {
              "@type": "Place",
              name: card.location,
            },
            offers: {
              "@type": "Offer",
              price: card.price,
              priceCurrency: "ILS",
              availability: "https://schema.org/InStock",
            },
            startDate: card.date,
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

            <Message
              message={message}
              setMessage={setMessage}
              className={styles.message}
            />

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
              onClick={() => handlePurchase(id, refId)}
            >
              לחץ לתשלום
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
