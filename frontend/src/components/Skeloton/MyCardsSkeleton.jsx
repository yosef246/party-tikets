import styles from "./MyCardsSkeleton.module.css";
import AllCardSkeleton from "./AllCardSkeleton";

export default function MyCardsSkeleton({ count }) {
  return (
    <div className={styles.middle}>
      <div className={styles.cardsContainer}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <AllCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
