import styles from "./AllCardSkeleton.module.css";

export default function AllCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.image} />
      <div className={styles.content}>
        <div className={styles.line} style={{ width: "70%" }} />
        <div className={styles.line} style={{ width: "50%" }} />
        <div className={styles.line} style={{ width: "60%" }} />
        <div className={styles.line} style={{ width: "40%" }} />
        <div className={styles.button} />
      </div>
    </div>
  );
}
