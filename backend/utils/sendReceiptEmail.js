import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReceiptEmail(user, post, purchases) {
  await resend.emails.send({
    from: "Party Tickets <onboarding@resend.dev>",
    to: user.email,
    subject: `קבלה לרכישת כרטיס - ${post.title}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <div style="background: linear-gradient(to right, #004B8E, #010528); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #61dafb; margin: 0;">Party Tickets 🎉</h1>
          <p style="color: white; margin: 10px 0 0;">קבלה לרכישת כרטיס</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <p style="font-size: 18px;">שלום <strong>${user.username}</strong>,</p>
          <p>תודה על רכישתך! הכרטיס שלך מחכה לך 🎊</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f0f4ff;">
              <td style="padding: 12px; font-weight: bold;">🎵 אירוע</td>
              <td style="padding: 12px;">${post.title}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold;">📍 מיקום</td>
              <td style="padding: 12px;">${post.location}</td>
            </tr>
            <tr style="background-color: #f0f4ff;">
              <td style="padding: 12px; font-weight: bold;">📅 תאריך</td>
              <td style="padding: 12px;">${new Date(post.date).toLocaleDateString("he-IL")}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold;">💰 מחיר</td>
              <td style="padding: 12px;">₪${post.price}</td>
            </tr>
            <tr style="background-color: #f0f4ff;">
              <td style="padding: 12px; font-weight: bold;">🔖 מספר הזמנה</td>
              <td style="padding: 12px;">${purchases._id}</td>
            </tr>
          </table>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
          <p>Party Tickets © 2025</p>
        </div>
      </div>
    `,
  });
}
