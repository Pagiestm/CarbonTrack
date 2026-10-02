import { Router } from 'express';
import { requireAdmin, requireAuth } from '../../shared/auth/middlewares.js';
import { idParams } from '../../shared/http/schemas.js';
import { validate } from '../../shared/http/validate.js';
import { categoryController } from './catalog.controller.js';
import { categoryBody } from './catalog.schemas.js';

export const categoryRouter = Router();

categoryRouter.use(requireAuth);

categoryRouter.get('/', categoryController.list);

categoryRouter.get('/categories-with-materials', categoryController.listWithMaterials);

categoryRouter.post('/', requireAdmin, validate({ body: categoryBody }), categoryController.create);

categoryRouter.put(
  '/:id',
  requireAdmin,
  validate({ params: idParams, body: categoryBody }),
  categoryController.update,
);

categoryRouter.delete(
  '/:id',
  requireAdmin,
  validate({ params: idParams }),
  categoryController.remove,
);
