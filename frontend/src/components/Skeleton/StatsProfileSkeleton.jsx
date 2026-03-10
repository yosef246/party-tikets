import styles from "./StatsProfileSkeleton.module.css";

export default function StatsSkeleton() {
  return (
    <div className={styles.middle}>
      <div className={styles.statsFloating}>
        <div className={styles.title} />
        <div className={styles.description} />
        <div className={styles.description} style={{ width: "60%" }} />
        <div className={styles.divider} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={styles.line}
            style={{ width: `${70 - i * 5}%` }}
          />
        ))}
      </div>
    </div>
  );
}
