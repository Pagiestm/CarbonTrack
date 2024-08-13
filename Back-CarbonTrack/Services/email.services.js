import nodemailer from 'nodemailer';

export async function sendEmail(to, subject, content, isHtml = false) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    [isHtml ? 'html' : 'text']: content,
  };

  await transporter.sendMail(mailOptions);
}