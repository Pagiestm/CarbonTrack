import { rateLimit } from 'express-rate-limit';

// L'API est derrière le proxy de Render : app.set('trust proxy', 1) fait que
// req.ip porte l'adresse réelle du client, et non celle du proxy.
const base = {
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez dans quelques minutes' },
};

// Garde-fou général, large : il n'existe que pour arrêter un emballement.
export const generalLimiter = rateLimit({
  ...base,
  windowMs: 60_000,
  limit: 300,
});

// Connexion et inscription : sans ça, un mot de passe se trouve par essais
// successifs. Seuls les échecs comptent, une session normale n'est pas gênée.
export const authLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60_000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { error: 'Trop de tentatives, réessayez dans quelques minutes' },
});

// Routes qui envoient un email sans être authentifiées : contact et mot de
// passe oublié. Sans limite, elles servent à inonder une boîte depuis notre
// compte SMTP.
export const emailLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60_000,
  limit: 5,
  message: { error: "Trop d'envois, réessayez dans une heure" },
});
