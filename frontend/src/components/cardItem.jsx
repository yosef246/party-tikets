import { Link } from "react-router-dom";
import styles from "./cardItem.module.css";

export default function CardItem({
  id,
  title,
  location,
  price,
  date,
  body,
  imageUrl,
}) {
  return (
    <>
      <div className={styles.card}>
        <Link to={`/card-details/${id}`}>
          <img src={imageUrl} alt={title} className={styles.image} />
        </Link>
        <div className={styles.content}>
          <h2>{title}</h2>
          <p>
            <strong>מיקום:</strong> {location}
          </p>
          <p>
            <strong>מחיר כרטיס:</strong> ₪{price}
          </p>
          <p>
            <strong>תאריך:</strong> {new Date(date).toLocaleDateString()}
          </p>
          <p>
            <strong>תיאור:</strong> {body}
          </p>
        </div>
      </div>
    </>
  );
}
