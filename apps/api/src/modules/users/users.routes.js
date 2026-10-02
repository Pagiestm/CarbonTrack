import { Router } from 'express';
import { requireAdmin, requireAuth } from '../../shared/auth/middlewares.js';
import { validate } from '../../shared/http/validate.js';
import { idParams } from '../../shared/http/schemas.js';
import { listQuery } from '../../shared/http/pagination.js';
import { usersController } from './users.controller.js';
import { changePasswordBody, changeRoleBody, updateProfileBody } from './users.schemas.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get('/', usersController.getProfile);

usersRouter.get('/admin/users', requireAdmin, validate({ query: listQuery }), usersController.list);

usersRouter.put('/', validate({ body: updateProfileBody }), usersController.updateProfile);

usersRouter.delete('/', usersController.deleteAccount);

usersRouter.put(
  '/password',
  validate({ body: changePasswordBody }),
  usersController.changePassword,
);

usersRouter.put(
  '/admin/users/:id/role',
  requireAdmin,
  validate({ params: idParams, body: changeRoleBody }),
  usersController.changeRole,
);

usersRouter.delete(
  '/admin/users/:id',
  requireAdmin,
  validate({ params: idParams }),
  usersController.deleteUser,
);
