import { Router } from 'express';
import { validate } from '../../shared/http/validate.js';
import { contactController } from './contact.controller.js';
import { contactBody } from './contact.schemas.js';
import { emailLimiter } from '../../shared/http/rate-limit.js';

export const contactRouter = Router();

contactRouter.post('/', emailLimiter, validate({ body: contactBody }), contactController.send);
