const { Router } = require('express')
const auth = require('../middlewares/auth')
const Authorization = require('../middlewares/authorization')
const LegacyParser = require('../middlewares/legacyParser')
const QueryStringTreatment = require('../middlewares/queryStringTreatment')
const AnalysisController = require('../controllers/AnalysisController')
const Validation = require('../validations/analysisAddValidation')

const router = Router()

router.route('/analysis')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
      QueryStringTreatment.treatQueryString(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Analysis']
    // #swagger.description = 'Endpoint para retornar todos os dados de Analysis'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/AnalysisList" } }
      return AnalysisController.paginate(req, res, next)
    }
  ])
  .post([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    Validation.validationRules(),
    async (req, res, next) => {
      // Translate the input to a format that better fits the AnalysisDTO
      await LegacyParser.parseAnalysisInput(req, res, next)
    },
    (req, res, next) => {
      Validation.validate(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['Analysis']
      // #swagger.description = 'Endpoint para cadastrar uma Análise'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddAnalysis" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemAnalysis" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return AnalysisController.create(req, res, next)
    }
  ])

router.route('/analysis/:id')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Analysis']
    // #swagger.description = 'Endpoint para retornar uma analise por id'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/AnalysisItem" } }
      return AnalysisController.get(req, res, next)
    }
  ])
  .delete([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Analysis']
    // #swagger.description = 'Endpoint para deletar um usuário'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/AnalysisItem" } }
      return AnalysisController.delete(req, res, next)
    }
  ])

module.exports = router
