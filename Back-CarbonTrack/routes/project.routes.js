import express from 'express';
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from '../Controllers/project.controller.js';
import { authMiddleware } from '../Middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - totalFootprint
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the project
 *         name:
 *           type: string
 *           description: The name of the project
 *         description:
 *           type: string
 *           description: The description of the project
 *         totalFootprint:
 *           type: number
 *           format: decimal
 *           description: The total carbon footprint of the project
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the project
 *         userId:
 *           type: integer
 *           description: The id of the user who created the project
 *       example:
 *         id: 1
 *         name: Project Alpha
 *         description: A sample project
 *         userId: 19
 *         materials:
 *           - materialId: 1
 *             quantity: 10
 *           - materialId: 3
 *             quantity: 5
 */

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve a list of projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get('/', authMiddleware, getAllProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Retrieve a single project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: A single project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
router.get('/:id', authMiddleware, getProjectById);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: The created project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
router.post('/', authMiddleware, createProject);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *           examples:
 *             example1:
 *               summary: Update project name and description
 *               value:
 *                 name: "Project Beta"
 *                 description: "An updated sample project"
 *                 materials:
 *                   - materialId: 1
 *                     quantity: 10
 *                   - materialId: 3
 *                     quantity: 5
 *             example2:
 *               summary: Add a new material
 *               value:
 *                 name: "Project Alpha"
 *                 description: "A sample project"
 *                 materials:
 *                   - materialId: 1
 *                     quantity: 10
 *                   - materialId: 3
 *                     quantity: 5
 *                   - materialId: 2
 *                     quantity: 7
 *             example3:
 *               summary: Remove an existing material
 *               value:
 *                 name: "Project Alpha"
 *                 description: "A sample project"
 *                 materials:
 *                   - materialId: 1
 *                     quantity: 10
 *             example4:
 *               summary: Update material quantities
 *               value:
 *                 name: "Project Alpha"
 *                 description: "A sample project"
 *                 materials:
 *                   - materialId: 1
 *                     quantity: 15
 *                   - materialId: 3
 *                     quantity: 8
 *             example5:
 *               summary: Update project without changing materials
 *               value:
 *                 name: "Project Gamma"
 *                 description: "A new description for the project"
 *                 materials:
 *                   - materialId: 1
 *                     quantity: 10
 *                   - materialId: 3
 *                     quantity: 5
 *     responses:
 *       200:
 *         description: The updated project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
router.put('/:id', authMiddleware, updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       204:
 *         description: No content
 */
router.delete('/:id', authMiddleware, deleteProject);

export { router };