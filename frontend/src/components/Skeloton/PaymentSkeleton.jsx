import styles from "./PaymentSkeleton.module.css";

export default function PaymentSkeleton() {
  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentBox}>
        <div className={styles.title} />
        <div className={styles.subtitle} />
        <div className={styles.input} />
        <div className={styles.input} />
        <div className={styles.row}>
          <div className={styles.halfInput} />
          <div className={styles.halfInput} />
        </div>
        <div className={styles.input} />
        <div className={styles.button} />
      </div>
    </div>
  );
}
