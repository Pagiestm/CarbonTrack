import { Router } from 'express';
import { validate } from '../../shared/http/validate.js';
import { passwordResetController } from './auth.controller.js';
import { requestResetBody, resetPasswordBody, tokenBody } from './auth.schemas.js';
import { authLimiter, emailLimiter } from '../../shared/http/rate-limit.js';

export const passwordResetRouter = Router();

passwordResetRouter.post(
  '/request-password-reset',
  emailLimiter,
  validate({ body: requestResetBody }),
  passwordResetController.request,
);

passwordResetRouter.post(
  '/reset-password',
  authLimiter,
  validate({ body: resetPasswordBody }),
  passwordResetController.reset,
);

passwordResetRouter.post(
  '/check-token',
  validate({ body: tokenBody }),
  passwordResetController.checkToken,
);
