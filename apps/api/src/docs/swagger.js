import { fileURLToPath } from 'node:url';
import swaggerJsdoc from 'swagger-jsdoc';

// La documentation est lue dans les commentaires @swagger des fichiers de routes.
const modulesDir = fileURLToPath(new URL('../modules/', import.meta.url)).replaceAll('\\', '/');

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de CarbonTrack',
      version: '1.0.0',
      description: "Documentation de l'API de CarbonTrack",
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [`${modulesDir}**/*.routes.js`],
});
