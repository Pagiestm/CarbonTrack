import { readFileSync } from 'node:fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

let transporter;

function getTransporter() {
  if (!env.SMTP_HOST) {
    throw new Error("SMTP_HOST n'est pas configuré : envoi d'email impossible");
  }
  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
  return transporter;
}

export async function sendMail({ to, subject, html, replyTo }) {
  await getTransporter().sendMail({ from: env.EMAIL_USER, to, subject, html, replyTo });
}

// Gabarits HTML générés depuis les fichiers .mjml voisins. Handlebars
// échappe les valeurs insérées avec {{ }}.
const templatesDir = new URL('../../templates/email/', import.meta.url);

export function loadTemplate(name) {
  return handlebars.compile(readFileSync(new URL(`${name}.html`, templatesDir), 'utf8'));
}
