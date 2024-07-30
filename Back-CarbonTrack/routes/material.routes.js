import express from 'express';
import {
    getAllMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial
} from '../Controllers/material.controller.js';
import { authMiddleware } from '../Middlewares/auth.middleware.js';
import { adminMiddleware } from '../Middlewares/admin.middleware.js';

const router = express.Router();

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
 *   description: Material management
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
router.get('/', authMiddleware, getAllMaterials);

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
router.get('/:id', authMiddleware, getMaterialById);

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
router.post('/', authMiddleware, adminMiddleware, createMaterial);

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
router.put('/:id', authMiddleware, adminMiddleware, updateMaterial);

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
router.delete('/:id', authMiddleware, adminMiddleware, deleteMaterial);

export { router };