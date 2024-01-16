const { Router } = require('express')
const swaggerFile = require('../../config/swagger_output.json')
const swaggerUi = require('swagger-ui-express')

const router = Router()

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

module.exports = router
