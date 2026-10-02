import { env } from '../../config/env.js';
import { renderTemplate, sendMail } from '../../shared/mail/mailer.js';

export async function sendContactMessage({ name, email, subject, message }) {
  await sendMail({
    to: env.CONTACT_EMAIL ?? env.EMAIL_USER,
    replyTo: email,
    subject: `Contact — ${subject}`,
    html: await renderTemplate('contact', {
      name,
      email,
      subject,
      message,
      preview: `${name} : ${subject}`,
      siteUrl: env.FRONTEND_URL,
    }),
  });
}
