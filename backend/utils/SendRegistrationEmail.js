import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendWelcomeEmail(newUser) {
  await resend.emails.send({
    from: "Party Tickets <onboarding@resend.dev>",
    to: newUser.email,
    subject: "ברוך הבא ל-PARTY TICKETS 🎉",
    html: `
      <div style="font-family: system-ui, sans-serif, Arial;
                  font-size: 16px;
                  text-align: right;
                  background-color: #fff8f1;
                  direction: rtl;">
        <div style="max-width: 600px; margin: auto; padding: 16px; line-height: 1.6;">

          <p>🎉 <strong>PARTY TICKETS</strong> <strong>${newUser.username} ברוך הבא</strong></p>

          <p>
            אנחנו שמחים שבחרת להצטרף אלינו! החשבון שלך נוצר בהצלחה &mdash;
            ומכאן הדרך פתוחה ליהנות מכל היכולות, ההטבות והאפשרויות
            שהפלטפורמה שלנו מציעה
          </p>

          <p>כדי להתחיל, פשוט לחץ על הכפתור הבא</p>

          <p>
            <a
              style="display: inline-block;
                     text-decoration: none;
                     color: #fff;
                     background-color: #d10ec4;
                     padding: 10px 20px;
                     border-radius: 6px;
                     font-weight: bold;"
              href="https://party-tikets.onrender.com"
              target="_blank"
              rel="noopener"
            >
              פתיחת PARTY TICKETS
            </a>
          </p>

          <p>
            אם יש לך שאלות או שאתה צריך עזרה &mdash;
            צוות התמיכה שלנו כאן בשבילך בכל רגע! אנחנו כאן לעזור בכל צעד.
            <br />
            אפשר לפנות אלינו במייל:
            <a
              style="color: #fc0038; text-decoration: none; font-weight: bold;"
              href="mailto:support@myapp.com"
            >
              support@myapp.com
            </a>
          </p>

          <p>
            שמחים שאתה איתנו,<br />
            צוות <strong>PARTY TICKETS</strong>
          </p>

        </div>
      </div>
    `,
  });
}
