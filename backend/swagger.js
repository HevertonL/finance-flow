const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinanceFlow API',
      version: '1.0.0',
      description: 'API para gestão financeira do projeto FinanceFlow',
      contact: {
        name: 'Heverton Luiz',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
  },
  apis: ['./index.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;