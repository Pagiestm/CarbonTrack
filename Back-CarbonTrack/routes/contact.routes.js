import express from 'express';
import { contactController } from '../Controllers/contact.controller.js';

const router = express.Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Send a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *           example:
 *             name: John Doe
 *             email: john.doe@example.com
 *             message: Hello, I would like to know more about your services.
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request, validation failed
 *       500:
 *         description: Error sending the message
 */
router.post('/', contactController.sendContactEmail());

export { router };