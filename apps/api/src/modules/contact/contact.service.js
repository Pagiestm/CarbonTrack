import { env } from '../../config/env.js';
import { loadTemplate, sendMail } from '../../shared/mail/mailer.js';

const contactTemplate = loadTemplate('contact');

// Le message part vers l'équipe (CONTACT_EMAIL, à défaut EMAIL_USER) ;
// « Répondre » renvoie directement au visiteur.
export async function sendContactMessage({ name, email, message }) {
  await sendMail({
    to: env.CONTACT_EMAIL ?? env.EMAIL_USER,
    replyTo: email,
    subject: `Nouveau message de contact de ${name}`,
    html: contactTemplate({ name, email, message }),
  });
}
