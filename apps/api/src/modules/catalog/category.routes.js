import { Router } from 'express';
import { requireAdmin, requireAuth } from '../../shared/auth/middlewares.js';
import { idParams } from '../../shared/http/schemas.js';
import { validate } from '../../shared/http/validate.js';
import { categoryController } from './catalog.controller.js';
import { categoryBody } from './catalog.schemas.js';

export const categoryRouter = Router();

categoryRouter.use(requireAuth);

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
categoryRouter.get('/', categoryController.list);

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
categoryRouter.get('/categories-with-materials', categoryController.listWithMaterials);

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
categoryRouter.post('/', requireAdmin, validate({ body: categoryBody }), categoryController.create);

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
categoryRouter.put(
  '/:id',
  requireAdmin,
  validate({ params: idParams, body: categoryBody }),
  categoryController.update,
);

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
categoryRouter.delete(
  '/:id',
  requireAdmin,
  validate({ params: idParams }),
  categoryController.remove,
);
