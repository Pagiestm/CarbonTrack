import express from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';
import { router as authRouter } from './routes/auth.routes.js';
import cors from 'cors';

const app = express();
const port = 3000;
const host = '0.0.0.0'; // Listen on all network interfaces

// Configure CORS to allow requests from your front-end domain
const corsOptions = {
  origin: 'https://carbontrack.mds-lille.yt',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware pour parser les requêtes JSON
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRouter);

app.listen(port, host, () => {
    console.log(`App started, listening on https://${host}:${port}`);
});