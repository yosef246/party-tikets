import styles from "./CardDetailsSkeleton.module.css";

export default function CardDetailsSkeleton() {
  return (
    <div className={styles.middle}>
      <div className={styles.cardDetails}>
        <div className={styles.image} />
        <div className={styles.content}>
          <div
            className={styles.line}
            style={{ width: "60%", height: "32px" }}
          />
          <div className={styles.line} style={{ width: "40%" }} />
          <div className={styles.line} style={{ width: "50%" }} />
          <div className={styles.line} style={{ width: "45%" }} />
          <div
            className={styles.line}
            style={{ width: "80%", height: "60px" }}
          />
          <div className={styles.buttons}>
            <div className={styles.button} />
            <div className={styles.button} />
          </div>
        </div>
      </div>
    </div>
  );
}
