import express from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`App started, listening to port ${port}`);
});