import bcrypt from 'bcryptjs';
import { env } from '../../config/env.js';
import { prisma } from '../../shared/db/prisma.js';
import { badRequest } from '../../shared/http/errors.js';
import { signResetToken, verifyResetToken } from '../../shared/auth/tokens.js';
import { renderTemplate, sendMail } from '../../shared/mail/mailer.js';

export async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${signResetToken(user)}`;
    await sendMail({
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: await renderTemplate('passwordReset', {
        name: user.name,
        resetLink,
        preview: 'Lien de réinitialisation, valable une heure',
        siteUrl: env.FRONTEND_URL,
      }),
    });
  }
  return {
    message: 'Si un compte existe pour cet email, un lien de réinitialisation vient d’être envoyé',
  };
}

async function checkResetToken(token) {
  const used = await prisma.invalidToken.findUnique({ where: { token } });
  if (used) {
    throw badRequest('Ce lien a déjà été utilisé');
  }
  try {
    return verifyResetToken(token).userId;
  } catch {
    throw badRequest('Lien invalide ou expiré');
  }
}

export async function checkToken(token) {
  await checkResetToken(token);
  return { message: 'Lien valide' };
}

export async function resetPassword({ token, newPassword }) {
  const userId = await checkResetToken(token);
  const password = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { password } }),
    prisma.invalidToken.create({ data: { token } }),
  ]);
  return { message: 'Mot de passe réinitialisé' };
}
