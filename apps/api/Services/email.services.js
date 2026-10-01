import nodemailer from 'nodemailer';

export async function sendEmail(to, subject, content, isHtml = false) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
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