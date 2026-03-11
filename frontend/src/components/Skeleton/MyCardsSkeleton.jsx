import styles from "./MyCardsSkeleton.module.css";
import AllCardSkeleton from "./AllCardSkeleton";

export default function AllCardsSkeleton({ count }) {
  return (
    <div className={styles.middle}>
      <div className={styles.cardsContainer}>
        {Array.from({ length: count }).map((_, i) => (
          <AllCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
