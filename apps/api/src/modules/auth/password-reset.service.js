import bcrypt from 'bcryptjs';
import { env } from '../../config/env.js';
import { prisma } from '../../shared/db/prisma.js';
import { badRequest } from '../../shared/http/errors.js';
import { signResetToken, verifyResetToken } from '../../shared/auth/tokens.js';
import { loadTemplate, sendMail } from '../../shared/mail/mailer.js';

const resetTemplate = loadTemplate('passwordReset');

// La réponse est la même que le compte existe ou non : la route ne permet
// pas de deviner quels emails sont inscrits.
export async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${signResetToken(user)}`;
    await sendMail({
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: resetTemplate({ name: user.name, resetLink }),
    });
  }
  return { message: 'Si un compte existe pour cet email, un lien de réinitialisation vient d’être envoyé' };
}

// Renvoie l'identifiant de l'utilisateur si le jeton est valide et inutilisé.
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

  // Le mot de passe change et le jeton est grillé dans la même transaction.
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { password } }),
    prisma.invalidToken.create({ data: { token } }),
  ]);
  return { message: 'Mot de passe réinitialisé' };
}
