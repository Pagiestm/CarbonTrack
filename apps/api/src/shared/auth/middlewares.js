import { forbidden, unauthorized } from '../http/errors.js';
import { verifyAccessToken } from './tokens.js';

export function requireAuth(req, res, next) {
  const [scheme, token] = req.get('authorization')?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    throw unauthorized();
  }

  try {
    const { userId, role } = verifyAccessToken(token);
    req.user = { id: userId, role };
  } catch {
    throw unauthorized('Session invalide ou expirée');
  }
  next();
}

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    throw forbidden('Réservé aux administrateurs');
  }
  next();
};

export const requireAdmin = requireRole('ADMIN');
