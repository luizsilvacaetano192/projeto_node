const { Router } = require('express')
const auth = require('../middlewares/auth')
const Authorization = require('../middlewares/authorization')
const QueryStringTreatment = require('../middlewares/queryStringTreatment')
const RealEstateController = require('../controllers/RealEstateController')
const Validation = require('../validations/realEstateAddValidation')
const UpdateValidation = require('../validations/realEstateUpdateValidation')
const ApplicationValidation = require('../validations/realEstateApplicationValidation')

const router = Router()

router.route('/real-estate')
  .get([
    (req, res, next) => {
      QueryStringTreatment.treatQueryString(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Real Estate']
    // #swagger.description = 'Endpoint para retornar todos os Real Estate paginados'
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/RealEstatePaginated" } }
      return RealEstateController.paginate(req, res, next)
    }
  ])
  .post([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    Validation.validationRules(),
    (req, res, next) => {
      Validation.validate(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['Real Estate']
      // #swagger.description = 'Endpoint para cadastrar uma Análise'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddRealEstate" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemRealEstate" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return RealEstateController.create(req, res, next)
    }
  ])

router.route('/real-estate/search')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
      QueryStringTreatment.treatQueryString(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Real Estate']
    // #swagger.description = 'Endpoint para retornar uma analise por id'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/RealEstateList" } }
      return RealEstateController.getWithFilter(req, res, next)
    }
  ])

router.route('/real-estate/:id')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Real Estate']
    // #swagger.description = 'Endpoint para retornar uma analise por id'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemRealEstate" } }
      return RealEstateController.get(req, res, next)
    }
  ])
  .put([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    UpdateValidation.validationRules(),
    (req, res, next) => {
      UpdateValidation.validate(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['Real Estate']
      // #swagger.description = 'Endpoint para cadastrar uma Análise'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddRealEstate" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemRealEstate" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return RealEstateController.update(req, res, next)
    }
  ])
  .delete([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Real Estate']
    // #swagger.description = 'Endpoint para deletar um usuário'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemRealEstate" } }
      return RealEstateController.delete(req, res, next)
    }
  ])

router.route('/real-estate/application')
  .post([
    ApplicationValidation.validationRules(),
    (req, res, next) => {
      ApplicationValidation.validate(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['Real Estate']
      // #swagger.description = 'Endpoint para realizar uma solicitação de criação de nova Imobiliária no sistema'
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/RealEstateApplication" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/RealEstateApplication" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/ValidationErrors" } }
      return RealEstateController.sendApplication(req, res, next)
    }
  ])

module.exports = router
