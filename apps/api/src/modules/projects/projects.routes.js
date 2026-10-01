import { Router } from 'express';
import { requireAdmin, requireAuth } from '../../shared/auth/middlewares.js';
import { idParams } from '../../shared/http/schemas.js';
import { validate } from '../../shared/http/validate.js';
import { projectsController } from './projects.controller.js';
import { projectBody } from './projects.schemas.js';

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

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
 *         name: Project Alpha
 *         description: A sample project
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
projectsRouter.get('/', projectsController.list);

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
projectsRouter.get('/:id', validate({ params: idParams }), projectsController.get);

/**
 * @swagger
 * /projects/admin/projects:
 *   get:
 *     summary: Retrieve a list of all projects for admins
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of all projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       403:
 *         description: Access denied
 */
projectsRouter.get('/admin/projects', requireAdmin, projectsController.listAll);

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
projectsRouter.post('/', validate({ body: projectBody }), projectsController.create);

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
projectsRouter.put('/:id', validate({ params: idParams, body: projectBody }), projectsController.update);

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
projectsRouter.delete('/:id', validate({ params: idParams }), projectsController.remove);

