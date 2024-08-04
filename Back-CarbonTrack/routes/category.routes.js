// category.routes.js
import express from 'express';
import { categoryController } from '../Controllers/category.controller.js';
import { authMiddleware } from '../Middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *       example:
 *         id: 1
 *         name: Metals
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', authMiddleware, categoryController.getAllCategories());

/**
 * @swagger
 * /categories/sync-carbontrack-webhook:
 *   post:
 *     summary: Synchronize categories via webhook
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: The event type (entry.create, entry.update, entry.delete)
 *               entry:
 *                 $ref: '#/components/schemas/Category'
 *               model:
 *                 type: string
 *                 description: The model type (should be 'category')
 *     responses:
 *       200:
 *         description: Synchronized successfully
 *       500:
 *         description: Internal server error
 */
router.post('/sync-category-webhook', categoryController.syncCategoryWebhook());

export { router };