import { Router } from 'express';
import { requireAdmin, requireAuth } from '../../shared/auth/middlewares.js';
import { idParams } from '../../shared/http/schemas.js';
import { validate } from '../../shared/http/validate.js';
import { projectsController } from './projects.controller.js';
import { projectBody } from './projects.schemas.js';
import { listQuery } from '../../shared/http/pagination.js';

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get('/', validate({ query: listQuery }), projectsController.list);

projectsRouter.get('/:id', validate({ params: idParams }), projectsController.get);

projectsRouter.get(
  '/admin/projects',
  requireAdmin,
  validate({ query: listQuery }),
  projectsController.listAll,
);

projectsRouter.post('/', validate({ body: projectBody }), projectsController.create);

projectsRouter.put(
  '/:id',
  validate({ params: idParams, body: projectBody }),
  projectsController.update,
);

projectsRouter.delete('/:id', validate({ params: idParams }), projectsController.remove);
