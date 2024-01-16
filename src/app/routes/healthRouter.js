const { Router } = require('express')
const HealthController = require('../controllers/HealthController')

const router = Router()

router.route('/health')
  .get([
    (req, res, next) => {
    // #swagger.tags = ['Health']
    // #swagger.description = 'Endpoint para checagem de resposta da aplicação'
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/HealthSuccess" } }
      return HealthController.test(req, res, next)
    }
  ])

module.exports = router
