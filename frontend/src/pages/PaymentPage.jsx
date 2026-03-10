import { useEffect, useState } from "react";
import styles from "./paymentPage.module.css";
import Message from "../components/message";
import PaymentSkeleton from "../components/Skeleton/PaymentSkeleton";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [haspaid, setHaspaid] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const navigate = useNavigate();
  const initialForm = { name: "", cardNumber: "", expiry: "", cvv: "" };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //בדיקה שיש טוקאן
  useEffect(() => {
    setLoadingSkeleton(true);
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check-auth", {
          credentials: "include", // כדי שהשרת יזהה את המשתמש מה-cookie
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        console.log("data:", data.user);

        if (data.user.hasPaid) {
          setHaspaid(true);
        }

        console.log("המשתמש מחובר:", data);
      } catch (err) {
        console.log("עליך להתחבר כדי לגשת לדף");
        navigate("/login");
      } finally {
        setLoadingSkeleton(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/payment/topay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", //גורם לדפדפן לשלוח את הקוקיז אוטומטית לשרת
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        setFormData(initialForm);
        return;
      }

      if (data.user.hasPaid) {
        setHaspaid(true);
      }

      setMessage(data.message);
      setFormData(initialForm);
    } catch (err) {
      setMessage("שגיאה בתשלום");
    }
  };

  const handleDeletePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/deletepay", {
        method: "DELETE",
        credentials: "include", //גורם לדפדפן לשלוח את הקוקיז אוטומטית לשרת
      });

      const data = await res.json();

      setHaspaid(false);
      setMessage(data.message);
    } catch (err) {
      setMessage("שגיאה במחיקה");
    }
  };

  if (loadingSkeleton) {
    return <PaymentSkeleton />;
  }

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentBox}>
        <h1>תשלום בכרטיס אשראי</h1>
        <p>הכנס את פרטי הכרטיס שלך כדי לשלם</p>

        <input
          type="text"
          name="name"
          placeholder="שם בעל הכרטיס"
          value={formData.name}
          onChange={handleChange}
          className={styles.inputField}
        />

        <input
          type="text"
          name="cardNumber"
          placeholder="מספר כרטיס"
          value={formData.cardNumber}
          onChange={handleChange}
          className={styles.inputField}
        />

        <div className={styles.row}>
          <input
            type="text"
            name="expiry"
            placeholder="תוקף (MM/YY)"
            value={formData.expiry}
            onChange={handleChange}
            className={`${styles.inputField} ${styles.halfInput}`}
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            className={`${styles.inputField} ${styles.halfInput}`}
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={styles.payBtn}
        >
          {loading ? "מעבד תשלום..." : "שלם עכשיו"}
        </button>

        {haspaid && (
          <button onClick={handleDeletePayment} className={styles.payBtn}>
            מחק עכשיו
          </button>
        )}
        {message && (
          <Message
            message={message}
            setMessage={setMessage}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
}
