import { Router } from 'express';
import { requireAdmin, requireAuth } from '../../shared/auth/middlewares.js';
import { idParams } from '../../shared/http/schemas.js';
import { validate } from '../../shared/http/validate.js';
import { materialController } from './catalog.controller.js';
import { materialBody, materialUpdateBody } from './catalog.schemas.js';
import { listQuery } from '../../shared/http/pagination.js';

export const materialRouter = Router();

materialRouter.get('/count', materialController.count);

materialRouter.use(requireAuth);

materialRouter.get('/', validate({ query: listQuery }), materialController.list);

materialRouter.get('/:id', validate({ params: idParams }), materialController.get);

materialRouter.post('/', requireAdmin, validate({ body: materialBody }), materialController.create);

materialRouter.put(
  '/:id',
  requireAdmin,
  validate({ params: idParams, body: materialUpdateBody }),
  materialController.update,
);

materialRouter.delete(
  '/:id',
  requireAdmin,
  validate({ params: idParams }),
  materialController.remove,
);
