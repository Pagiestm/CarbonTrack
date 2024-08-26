import express from 'express';
import { passwordResetController } from '../Controllers/passwordReset.controller.js';

const router = express.Router();

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
router.post('/request-password-reset', passwordResetController.requestPasswordReset());

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
router.post('/reset-password', passwordResetController.resetPassword());

export { router };