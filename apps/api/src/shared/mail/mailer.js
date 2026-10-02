import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import handlebars from 'handlebars';
import mjml2html from 'mjml';
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

const templatesDir = new URL('../../templates/email/', import.meta.url);
const cache = new Map();

async function compiler(name) {
  const chemin = new URL(`${name}.mjml`, templatesDir);
  const { html, errors } = await mjml2html(readFileSync(chemin, 'utf8'), {
    filePath: dirname(fileURLToPath(chemin)),
    validationLevel: 'strict',
  });

  if (errors?.length) {
    const details = errors.map((e) => e.formattedMessage ?? e.message).join(' · ');
    throw new Error(`Gabarit ${name}.mjml invalide : ${details}`);
  }

  return handlebars.compile(html);
}

export async function renderTemplate(name, data = {}) {
  if (!cache.has(name)) {
    cache.set(name, compiler(name));
  }
  const gabarit = await cache.get(name);
  return gabarit(data);
}
