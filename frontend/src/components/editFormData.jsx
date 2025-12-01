import { useState } from "react";
import styles from "./editFormData.module.css";

export default function EditPostForm({ id, post, onUpdate, onCancel }) {
  const [title, setTitle] = useState(post.title);
  const [location, setLocation] = useState(post.location);
  const [date, setDate] = useState(post.date.slice(0, 10));
  const [body, setBody] = useState(post.body);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, location, date, body, imageUrl }),
      });

      //המידע החדש שעידכנת
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      if (
        data.title === post.title &&
        data.location === post.location &&
        data.date === post.date &&
        data.body === post.body &&
        data.imageUrl === post.imageUrl
      ) {
        alert("לא שינית כלום");
        return;
      } else {
        alert("הכרטיס עודכן בהצלחה!");
        onUpdate(data); // מחזיר את הפוסט המעודכן למעלה
      }
    } catch (err) {
      console.error("שגיאה בעדכון:", err);
      alert("עדכון נכשל");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className={styles.loading}>טוען . . .</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>עריכת כרטיס</h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="כותרת"
        required
      />
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="מיקום"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="תיאור"
        required
      />
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="קישור לתמונה"
        required
      />

      <button type="submit">שמור</button>
      <button type="button" onClick={onCancel}>
        ביטול
      </button>
    </form>
  );
}
