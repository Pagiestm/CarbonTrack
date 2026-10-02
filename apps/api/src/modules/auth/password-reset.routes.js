import { Router } from 'express';
import { validate } from '../../shared/http/validate.js';
import { passwordResetController } from './auth.controller.js';
import { requestResetBody, resetPasswordBody, tokenBody } from './auth.schemas.js';

export const passwordResetRouter = Router();

/**
 * @swagger
 * /password-reset/request-password-reset:
 *   post:
 *     summary: Request a password reset
 *     tags: [PasswordReset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: test@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request
 */
passwordResetRouter.post(
  '/request-password-reset',
  validate({ body: requestResetBody }),
  passwordResetController.request,
);

/**
 *@swagger
 * /password-reset/reset-password:
 *   post:
 *     summary: Reset the password
 *     tags: [PasswordReset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             example:
 *               token: your_jwt_token_here
 *               newPassword: NewPassword123*
 *               confirmPassword: NewPassword123*
 *     responses:
 *       200:
 *         description: Password has been reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request
 */
passwordResetRouter.post(
  '/reset-password',
  validate({ body: resetPasswordBody }),
  passwordResetController.reset,
);

/**
 * @swagger
 * /password-reset/check-token:
 *   post:
 *     summary: Check that a password reset token is valid and unused
 *     tags: [PasswordReset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Token is invalid, expired or already used
 */
passwordResetRouter.post(
  '/check-token',
  validate({ body: tokenBody }),
  passwordResetController.checkToken,
);
