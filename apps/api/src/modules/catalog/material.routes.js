import { Router } from 'express';
import { requireAdmin, requireAuth } from '../../shared/auth/middlewares.js';
import { idParams } from '../../shared/http/schemas.js';
import { validate } from '../../shared/http/validate.js';
import { materialController } from './catalog.controller.js';
import { materialBody, materialUpdateBody } from './catalog.schemas.js';
import { listQuery } from '../../shared/http/pagination.js';

export const materialRouter = Router();

materialRouter.use(requireAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - supplier
 *         - carbonFootprint
 *         - unit
 *         - pricePerUnit
 *         - categoryId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the material
 *         name:
 *           type: string
 *           description: The name of the material
 *         supplier:
 *           type: string
 *           description: The supplier of the material
 *         carbonFootprint:
 *           type: number
 *           format: decimal
 *           description: The carbon footprint of the material
 *         unit:
 *           type: string
 *           description: The unit of the material
 *         pricePerUnit:
 *           type: number
 *           format: decimal
 *           description: The price per unit of the material
 *         categoryId:
 *           type: integer
 *           description: The id of the category
 *       example:
 *         id: 1
 *         name: Steel
 *         supplier: ABC Corp
 *         carbonFootprint: 12.34
 *         unit: kg
 *         pricePerUnit: 100.50
 *         categoryId: 2
 */

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: Hardware management (Only for admins)
 */

/**
 * @swagger
 * /materials:
 *   get:
 *     summary: Retrieve a list of materials
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: A list of materials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 */
materialRouter.get('/', validate({ query: listQuery }), materialController.list);

/**
 * @swagger
 * /materials/{id}:
 *   get:
 *     summary: Retrieve a single material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Material ID
 *     responses:
 *       200:
 *         description: A single material
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 */
materialRouter.get('/:id', validate({ params: idParams }), materialController.get);

/**
 * @swagger
 * /materials:
 *   post:
 *     summary: Create a new material
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *     responses:
 *       201:
 *         description: The created material
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 */
materialRouter.post('/', requireAdmin, validate({ body: materialBody }), materialController.create);

/**
 * @swagger
 * /materials/{id}:
 *   put:
 *     summary: Update a material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Material ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *     responses:
 *       200:
 *         description: The updated material
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 */
materialRouter.put(
  '/:id',
  requireAdmin,
  validate({ params: idParams, body: materialUpdateBody }),
  materialController.update,
);

/**
 * @swagger
 * /materials/{id}:
 *   delete:
 *     summary: Delete a material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Material ID
 *     responses:
 *       204:
 *         description: No content
 */
materialRouter.delete(
  '/:id',
  requireAdmin,
  validate({ params: idParams }),
  materialController.remove,
);
