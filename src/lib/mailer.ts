import nodemailer from "nodemailer";

export async function sendEmailNotification(
  to: string,
  message: string,
  link?: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your email service
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"CampusBridge" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "📬 You have a new notification!",
    html: `
      <p>${message}</p>
      ${link ? `<p><a href="${link}">View Details</a></p>` : ""}
      <p style="font-size:12px;color:gray;">This is an automated notification from CampusBridge.</p>
    `,
  });
}
