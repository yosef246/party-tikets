import { useState } from "react";
import styles from "./cardItem.module.css";
import EditPostForm from "./editFormData";
import { Link } from "react-router-dom";

export default function MyCardItem(props) {
  const [edit, setEdit] = useState(false);
  const [postData, setPostData] = useState(props);
  const { id, onDelete } = props;

  async function handleDelete() {
    try {
      const response = await fetch(`http://localhost:3001/api/post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete post");
      }

      alert("הכרטיס נמחק בהצלחה");
      onDelete();
    } catch (error) {
      alert("משהו השתבש");
      console.error("Error deleting post:", error);
    }
  }

  return (
    <div className={styles.card}>
      {edit ? (
        <EditPostForm
          id={id}
          post={postData}
          onUpdate={(newData) => {
            setPostData(newData);
            setEdit(false);
          }}
          onCancel={() => setEdit(false)}
        />
      ) : (
        <>
          <Link to={`/card-details/${id}`}>
            <img
              src={postData.imageUrl}
              alt={postData.title}
              className={styles.image}
            />
          </Link>
          <div className={styles.content}>
            <h2>{postData.title}</h2>
            <p>
              <strong>מיקום:</strong> {postData.location}
            </p>
            <p>
              <strong>מחיר כרטיס:</strong> ₪{postData.price}
            </p>
            <p>
              <strong>תאריך: </strong>
              {new Date(postData.date).toLocaleDateString()}
            </p>
            <p>
              <strong>תיאור:</strong> {postData.body}
            </p>
            <button onClick={handleDelete} className={styles.button}>
              מחק כרטיס
            </button>
            <button onClick={() => setEdit(true)} className={styles.button}>
              שנה כרטיס
            </button>
          </div>
        </>
      )}
    </div>
  );
}
