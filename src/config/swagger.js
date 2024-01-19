// https://davibaltar.medium.com/documenta%C3%A7%C3%A3o-autom%C3%A1tica-de-apis-em-node-js-eb03041c643b
// https://github.com/davibaltar/swagger-autogen#usage-with-optionals

const swaggerAutogen = require('swagger-autogen')()
const fs = require('fs')
const healthSchema = require('./swaggerSchemas/healthSchema')
const userSchema = require('./swaggerSchemas/userSchema')
const bankSchema = require('./swaggerSchemas/bankSchema')
const analysisSchema = require('./swaggerSchemas/analysisSchema')
const processSchema = require('./swaggerSchemas/processSchema')
const historySchema = require('./swaggerSchemas/historySchema')
const phaseSchema = require('./swaggerSchemas/phaseSchema')
const realEstateSchema = require('./swaggerSchemas/realEstateSchema')
const observationSchema = require('./swaggerSchemas/observationSchema')
const notificationSchema = require('./swaggerSchemas/notificationSchema')
const loginSchema = require('./swaggerSchemas/loginSchema')

const outputFile = './src/config/swagger_output.json'

const endpointsFiles = []

fs
  .readdirSync('./src/app/routes')
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    endpointsFiles.push(`./src/app/routes/${file}`)
  })

const doc = {
  info: {
    version: '1.0.0',
    title: 'API ',
    description: 'API da '
  },
  host: process.env.BASE_URL,
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Health',
      description: 'Checagem de resposta da aplicação'
    },
    {
      name: 'User',
      description: 'Gerenciamento de usuários'
    },
    {
      name: 'Login',
      description: 'Gerenciamento endpoints de Login'
    },
    {
      name: 'Banks',
      description: 'Gerenciamento de bancos'
    },
    {
      name: 'Analysis',
      description: 'Gerenciamento de Analises'
    },
    {
      name: 'Process',
      description: 'Gerenciamento de Processos'
    },
    {
      name: 'Real Estate',
      description: 'Gerenciamento Imobiliárias'
    },
    {
      name: 'Observation',
      description: 'Gerenciamento de Observações'
    }
  ],
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Token de autorização (faça login para pegar o valor). O formato deve ser Bearer asdLKSJFD00i832...'
    }
  },
  definitions: {
    LegacyValidationErrors: {
      error: true,
      message: 'mensagem de erro'
    },
    ValidationErrors: {
      errors: [
        { campo: 'mensagem de erro' }
      ]
    },
    NotAuthorizedError: {
      message: 'Acesso não autorizado'
    },
    AuthBearer: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZmNjkxYWIyLWZjYzMtNGNiNy1hMjM0LWMzYTBlOTEyNzVkNyIsImlhdCI6MTYxNjQ1MTQ4NiwiZXhwIjoxNjE2NDUyMzg2fQ.EBPYRpGZYgRzV619Uejk8Teh2-AyxZvgnwDPCsNuNO4'
    },
    ...healthSchema,
    ...userSchema,
    ...bankSchema,
    ...analysisSchema,
    ...processSchema,
    ...historySchema,
    ...phaseSchema,
    ...realEstateSchema,
    ...observationSchema,
    ...notificationSchema,
    ...loginSchema
  }
}

swaggerAutogen(outputFile, endpointsFiles, doc)
