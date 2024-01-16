const { Router } = require('express')
const auth = require('../middlewares/auth')
const Authorization = require('../middlewares/authorization')
const QueryStringTreatment = require('../middlewares/queryStringTreatment')
const BankController = require('../controllers/BankController')
const Validation = require('../validations/banksAddValidation')

const router = Router()

router.route('/banks')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
      QueryStringTreatment.treatQueryString(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Banks']
    // #swagger.description = 'Endpoint para retornar todos os dados de Bancos'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/BankList" } }
      return BankController.paginate(req, res, next)
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
      // #swagger.tags = ['Banks']
      // #swagger.description = 'Endpoint para cadastrar um banco'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddBank" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemBank" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }

      return BankController.create(req, res, next)
    }
  ])

router.route('/banks/:id')
  .put([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    Validation.validationRules(),
    (req, res, next) => {
      Validation.validate(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['Banks']
      // #swagger.security = [{"jwt": []}]
      // #swagger.description = 'Endpoint para fazer update de um Bank'
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddBank" } } */
      // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemBank" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return BankController.update(req, res, next)
    }
  ])


  router.route('/banks-all')
  .put([
    
    auth.bearer,
   // (req, res, next) => {
 
    //  Authorization.authorize(req, res, next)
      
   // },
    Validation.validationRules(),
   // (req, res, next) => {
    //  Validation.validate(req, res, next)
   //   console.log('aq')
   // },
    (req, res, next) => {
      
      // #swagger.tags = ['Banks']
      // #swagger.security = [{"jwt": []}]
      // #swagger.description = 'Endpoint para fazer update de um Bank'
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddBank" } } */
      // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemBank" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
     
      return BankController.updateAll(req.body,next,req,res)
    }
  ])

  .delete([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Banks']
    // #swagger.security = [{"jwt": []}]
    // #swagger.description = 'Endpoint para deletar um Bank'
    // #swagger.responses[204] = { description: 'Sucesso na deleção' }
    // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }

      return BankController.delete(req, res, next)
    }
  ])

module.exports = router
