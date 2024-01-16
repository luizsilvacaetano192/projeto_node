const { Router } = require('express')
const auth = require('../middlewares/auth')
const Authorization = require('../middlewares/authorization')
const HistoryController = require('../controllers/HistoryController')
const Validation = require('../validations/userRegisterAddValidation')

const router = Router()

router.route('/history/:id')
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
      // #swagger.tags = ['History']
      // #swagger.description = 'Endpoint para cadastrar um novo UserRegister no histórico da Phase'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddUserRegister" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemUserRegister" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }

      return HistoryController.saveUserRegister(req, res, next)
    }
  ])
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
      // #swagger.tags = ['History']
      // #swagger.description = 'Endpoint para fazer update de um History'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddUserRegister" } } */
      // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemUserRegister" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return HistoryController.update(req, res, next)
    }
  ])
  .delete([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['History']
    // #swagger.description = 'Endpoint para deletar um UserRegister'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[204] = { description: 'Sucesso na deleção' }
    // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }

      return HistoryController.delete(req, res, next)
    }
  ])

module.exports = router
