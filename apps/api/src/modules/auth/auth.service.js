import bcrypt from 'bcryptjs';
import { prisma } from '../../shared/db/prisma.js';
import { badRequest, conflict } from '../../shared/http/errors.js';
import { signAccessToken } from '../../shared/auth/tokens.js';
import { loadTemplate, sendMail } from '../../shared/mail/mailer.js';
import { publicUserSelect } from '../users/users.select.js';
import { fetchGoogleProfile } from './google.client.js';

const confirmationTemplate = loadTemplate('registrationConfirmation');

// L'email de bienvenue ne doit pas faire échouer une inscription réussie.
async function sendWelcomeEmail(user) {
  try {
    await sendMail({
      to: user.email,
      subject: "Confirmation d'inscription",
      html: confirmationTemplate({ name: user.name }),
    });
  } catch (error) {
    console.error("Email de confirmation non envoyé :", error.message);
  }
}

export async function register({ email, password, name }) {
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    throw conflict('Un compte existe déjà avec cet email');
  }

  const user = await prisma.user.create({
    data: { email, name, role: 'USER', password: await bcrypt.hash(password, 10) },
    select: publicUserSelect,
  });
  await sendWelcomeEmail(user);
  return user;
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Un compte créé par Google n'a pas de mot de passe : bcrypt.compare échoue.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw badRequest('Email ou mot de passe incorrect');
  }

  const { password: _hash, ...publicUser } = user;
  return { token: signAccessToken(user), user: publicUser };
}

// Connexion Google : retrouve le compte par email ou par identifiant Google,
// le crée au besoin, et rattache l'identifiant Google à un compte existant.
export async function loginWithGoogle(code) {
  const { email, name, googleId } = await fetchGoogleProfile(code);

  let user = await prisma.user.findFirst({ where: { OR: [{ email }, { googleId }] } });

  if (!user) {
    user = await prisma.user.create({ data: { email, name, password: '', role: 'USER', googleId } });
    await sendWelcomeEmail(user);
  } else if (!user.googleId) {
    user = await prisma.user.update({ where: { id: user.id }, data: { googleId } });
  }

  return { token: signAccessToken(user) };
}
