import express from 'express';
import { categoryController } from '../Controllers/category.controller.js';
import { authMiddleware } from '../Middlewares/auth.middleware.js';
import { adminMiddleware } from '../Middlewares/admin.middleware.js';

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
 * /categories/{id}:
 *   get:
 *     summary: Retrieve a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: A single category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get('/:id', authMiddleware, categoryController.getCategoryById());

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

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *                 example: "New Category"
 *     responses:
 *       201:
 *         description: The created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory());

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the category
 *                 example: "Updated Category"
 *     responses:
 *       200:
 *         description: The updated category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, adminMiddleware, categoryController.updateCategory());

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete an existing category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory());

export { router };
