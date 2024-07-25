import express from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';
import { router as authRouter } from './routes/auth.routes.js';
import cors from 'cors';

const app = express();
const port = 3000;

// Autoriser toutes les origines
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour gérer les requêtes OPTIONS
app.options('*', cors());

// Ajout manuel des en-têtes CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`App started, listening to port ${port}`);
});