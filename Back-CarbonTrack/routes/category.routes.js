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
 *     CategoryWithMaterials:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         materials:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The auto-generated id of the material
 *               name:
 *                 type: string
 *                 description: The name of the material
 *       example:
 *         id: 1
 *         name: Metals
 *         materials:
 *           - id: 1
 *             name: Steel
 *           - id: 2
 *             name: Copper
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management (Only for admins)
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
 * /categories/categories-with-materials:
 *   get:
 *     summary: Retrieve a list of categories with their associated materials
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories with materials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryWithMaterials'
 */
router.get('/categories-with-materials', authMiddleware, categoryController.getCategoriesWithMaterials());

export { router };
