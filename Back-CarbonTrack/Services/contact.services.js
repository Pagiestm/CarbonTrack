import { sendEmail } from './email.services.js';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charge et compile le template HTML
const templatePath = path.resolve(__dirname, '../../Front-CarbonTrack/src/components/email/contact.html');
const source = fs.readFileSync(templatePath, 'utf-8');
const template = handlebars.compile(source);

export class ContactService {
  async sendContactEmail(name, email, message) {
    // Prépare le contenu de l'email en utilisant le template HTML
    const htmlContent = template({ name, email, message });

    // Envoi de l'email de contact
    await sendEmail(email, 'Nouveau message de contact', htmlContent, true);
  }
}