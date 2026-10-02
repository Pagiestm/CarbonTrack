import { Router } from 'express';
import { requireAdmin, requireAuth } from '../../shared/auth/middlewares.js';
import { validate } from '../../shared/http/validate.js';
import { idParams } from '../../shared/http/schemas.js';
import { listQuery } from '../../shared/http/pagination.js';
import { usersController } from './users.controller.js';
import { changePasswordBody, changeRoleBody, updateProfileBody } from './users.schemas.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
usersRouter.get('/', usersController.getProfile);

/**
 * @swagger
 * /profile/admin/users:
 *   get:
 *     summary: Retrieve a list of all users for admins
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: A list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Access denied
 */
usersRouter.get('/admin/users', requireAdmin, validate({ query: listQuery }), usersController.list);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
usersRouter.put('/', validate({ body: updateProfileBody }), usersController.updateProfile);

/**
 * @swagger
 * /profile:
 *   delete:
 *     summary: Delete user account and related projects
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account and related projects deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
usersRouter.delete('/', usersController.deleteAccount);

/**
 * @swagger
 * /profile/password:
 *   put:
 *     summary: Change the password of the signed-in account
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Current password incorrect, or Google account
 */
usersRouter.put(
  '/password',
  validate({ body: changePasswordBody }),
  usersController.changePassword,
);

/**
 * @swagger
 * /profile/admin/users/{id}/role:
 *   put:
 *     summary: Change a user role (admin)
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Role changed
 *       400:
 *         description: Cannot change your own role
 */
usersRouter.put(
  '/admin/users/:id/role',
  requireAdmin,
  validate({ params: idParams, body: changeRoleBody }),
  usersController.changeRole,
);

/**
 * @swagger
 * /profile/admin/users/{id}:
 *   delete:
 *     summary: Delete a user and their projects (admin)
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Account deleted
 */
usersRouter.delete(
  '/admin/users/:id',
  requireAdmin,
  validate({ params: idParams }),
  usersController.deleteUser,
);
