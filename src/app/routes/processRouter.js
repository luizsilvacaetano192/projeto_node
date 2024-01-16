const { Router } = require('express')
const auth = require('../middlewares/auth')
const Authorization = require('../middlewares/authorization')
const ProcessController = require('../controllers/ProcessController')
const LegacyParser = require('../middlewares/legacyParser')
const ProcessAddValidation = require('../validations/processAddValidation')
const QueryStringTreatment = require('../middlewares/queryStringTreatment')

const router = Router()

router.route('/process/:id')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Process']
    // #swagger.description = 'Endpoint para retornar um process por id'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ProcessItem" } }
      return ProcessController.get(req, res, next)
    }
  ])
  .delete([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['Process']
      // #swagger.description = 'Endpoint para deletar um Process'
      // #swagger.security = [{"jwt": []}]
      // #swagger.responses[204] = { description: 'Sucesso na deleção' }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }

      return ProcessController.delete(req, res, next)
    }
  ])

router.route('/process')
  .post([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    ProcessAddValidation.validationRules(),
    async (req, res, next) => {
      // Translate the input to a format that better fits the processDTO
      await LegacyParser.parseProcessInput(req, res, next)
    },
    (req, res, next) => {
      ProcessAddValidation.validate(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['Process']
      // #swagger.description = 'Endpoint para cadastrar um process'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddProcess" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ProcessItem" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return ProcessController.create(req, res, next)
    }
  ])
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
      QueryStringTreatment.treatQueryString(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Process']
    // #swagger.description = 'Endpoint para retornar os dados de Process paginados de acordo com os filtros passados'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ProcessPaginated2" } }
      return ProcessController.paginate(req, res, next)
    }
  ])

router.route('/process/user/:id')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Process']
    // #swagger.description = 'Endpoint para retornar um process por id de Usuário ou Real Estate'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ProcessList" } }
      return ProcessController.getProcessByUserId(req, res, next)
    }
  ])

router.route('/process/buyer/:id/count')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Process']
    // #swagger.description = 'Endpoint para retornar um quantia de processos onde o id de comprador passado está registrado'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { count: 1 } }
      return ProcessController.getProcessCountByBuyerId(req, res, next)
    }
  ])

router.route('/process-home')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
      QueryStringTreatment.treatQueryString(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Process']
    // #swagger.description = 'Endpoint para retornar processos paginados de acordo com o filtro passado na query string'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ProcessPaginated" } }
      return ProcessController.paginateHome(req, res, next)
    }
  ])

  router.route('/process-home-no-paginate')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
      QueryStringTreatment.treatQueryString(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Process']
    // #swagger.description = 'Endpoint para retornar processos paginados de acordo com o filtro passado na query string'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ProcessPaginated" } }
      return ProcessController.paginate(req, res, next)
    }
  ])

router.route('/process/:id/history')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Process']
    // #swagger.description = 'Endpoint para retornar histórico do processo'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ProcessHistory" } }
      return ProcessController.getProcessHistory(req, res, next)
    }
  ])

module.exports = router
