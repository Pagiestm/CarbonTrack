import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { passwordResetController } from '../Controllers/passwordReset.controller.js';

const router = express.Router();
const prisma = new PrismaClient();

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

// Endpoint pour vérifier la validité du token
router.post('/check-token', async (req, res) => {
    const { token } = req.body;
    try {
        const invalidToken = await prisma.invalidToken.findUnique({ where: { token } });
        if (invalidToken) {
            return res.status(400).json({ error: 'Token has already been used' });
        }

        jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
});

export { router };