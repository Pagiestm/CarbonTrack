import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from './email.services.js';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charge et compile le template HTML
const templatePath = path.resolve(__dirname, '../../Front-CarbonTrack/src/components/email/registrationConfirmation.html');
const source = fs.readFileSync(templatePath, 'utf-8');
const template = handlebars.compile(source);

export class AuthService {
  async register(email, password, name, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    // Prépare le contenu de l'email en utilisant le template HTML
    const htmlContent = template({ name: user.name });

    // Envoi de l'email de confirmation
    await sendEmail(user.email, 'Confirmation d\'inscription', htmlContent, true);

    return user;
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return { token, user };
  }
}