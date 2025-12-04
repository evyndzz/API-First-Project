import swaggerJsdoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory Management API',
    version: '1.0.0',
    description: 'API untuk sistem manajemen inventory produk elektronik dengan integrasi Exchange Rate API dan QR Code Generator',
    contact: {
      name: 'API Support',
      email: 'support@inventory.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan JWT token yang didapat dari endpoint /api/auth/login'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
}

const options = {
  definition: swaggerDefinition,
  apis: [
    './app/controllers/Http/**/*.ts',
    './start/routes.ts'
  ]
}

export const swaggerSpec = swaggerJsdoc(options)

