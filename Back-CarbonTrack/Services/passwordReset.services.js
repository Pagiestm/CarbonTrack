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

// Charge et compile le template HTML pour la réinitialisation du mot de passe
const templatePath = path.resolve(__dirname, '../../Front-CarbonTrack/src/components/email/passwordReset.html');
const source = fs.readFileSync(templatePath, 'utf-8');
const template = handlebars.compile(source);

export class PasswordResetService {
  async requestPasswordReset(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Détermine l'URL de réinitialisation en fonction de l'environnement
    const frontendUrl = process.env.NODE_ENV === 'development'
      ? process.env.DEV_FRONTEND_URL
      : process.env.PROD_FRONTEND_URL;

    // Prépare le contenu de l'email en utilisant le template HTML
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;
    const htmlContent = template({ name: user.name, resetLink });

    // Envoi de l'email de réinitialisation
    await sendEmail(user.email, 'Password Reset Request', htmlContent, true);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token, newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Vérifiez si le token a déjà été utilisé
    const invalidToken = await prisma.invalidToken.findUnique({ where: { token } });
    if (invalidToken) {
      throw new Error('Token has already been used');
    }

    // Vérifiez et décodez le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Hachez le nouveau mot de passe et mettez à jour l'utilisateur
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Marquez le token comme utilisé
    await prisma.invalidToken.create({ data: { token } });

    return { message: 'Password has been reset' };
  }
}