import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

const RESET_PURPOSE = 'password-reset';

export function signAccessToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (payload.purpose) {
    throw new jwt.JsonWebTokenError('Jeton de session attendu');
  }
  return payload;
}

export function signResetToken(user) {
  return jwt.sign({ userId: user.id, purpose: RESET_PURPOSE }, env.JWT_SECRET, { expiresIn: '1h' });
}

export function verifyResetToken(token) {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (payload.purpose !== RESET_PURPOSE) {
    throw new jwt.JsonWebTokenError('Jeton de réinitialisation attendu');
  }
  return payload;
}
