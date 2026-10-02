import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './docs/swagger.js';
import { errorHandler, notFoundHandler } from './shared/http/error-handler.js';
import { generalLimiter } from './shared/http/rate-limit.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { passwordResetRouter } from './modules/auth/password-reset.routes.js';
import { usersRouter } from './modules/users/users.routes.js';
import { categoryRouter } from './modules/catalog/category.routes.js';
import { materialRouter } from './modules/catalog/material.routes.js';
import { projectsRouter } from './modules/projects/projects.routes.js';
import { contactRouter } from './modules/contact/contact.routes.js';

export function createApp() {
  const app = express();

  // Render place l'API derrière un proxy : l'IP réelle est dans X-Forwarded-For.
  app.set('trust proxy', 1);
  app.use(helmet());
  // En production, le client appelle l'API sur sa propre origine (/api) ;
  // CORS ne sert qu'au développement, où client et API ont chacun leur port.
  app.use(cors({ origin: env.FRONTEND_URL }));
  app.use(express.json({ limit: '100kb' }));
  app.use(generalLimiter);

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/auth', authRouter);
  app.use('/password-reset', passwordResetRouter);
  app.use('/profile', usersRouter);
  app.use('/categories', categoryRouter);
  app.use('/materials', materialRouter);
  app.use('/projects', projectsRouter);
  app.use('/contact', contactRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
