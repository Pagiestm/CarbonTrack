import { Router } from 'express';
import { validate } from '../../shared/http/validate.js';
import { authController } from './auth.controller.js';
import { loginBody, registerBody } from './auth.schemas.js';
import { authLimiter } from '../../shared/http/rate-limit.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  authLimiter,
  validate({ body: registerBody }),
  authController.register,
);

authRouter.post('/login', authLimiter, validate({ body: loginBody }), authController.login);

authRouter.get('/google', authController.googleRedirect);
authRouter.get('/google/callback', authController.googleCallback);
