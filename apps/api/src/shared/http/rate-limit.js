import { rateLimit } from 'express-rate-limit';

const base = {
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez dans quelques minutes' },
};

export const generalLimiter = rateLimit({
  ...base,
  windowMs: 60_000,
  limit: 300,
});

export const authLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60_000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { error: 'Trop de tentatives, réessayez dans quelques minutes' },
});

export const emailLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60_000,
  limit: 5,
  message: { error: "Trop d'envois, réessayez dans une heure" },
});
