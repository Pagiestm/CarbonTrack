import express from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';
import { router as authRouter } from './routes/auth.routes.js';
import { router as profileRouter } from './routes/profile.routes.js';
import { router as materialRoutes } from './routes/material.routes.js';
import { router as categoryRoutes } from './routes/category.routes.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/materials', materialRoutes);
app.use('/categories', categoryRoutes);

app.listen(port, () => {
    console.log(`App started, listening to port ${port}`);
});