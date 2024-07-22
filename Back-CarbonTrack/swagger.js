import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de CarbonTrack',
      version: '1.0.0',
      description: 'Documentation de l\'API de CarbonTrack',
    },
  },
  apis: ['./routes/*.js'], // Assurez-vous que ce chemin correspond à l'emplacement de vos fichiers de route
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;