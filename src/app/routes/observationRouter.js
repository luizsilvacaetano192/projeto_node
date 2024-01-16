const { Router } = require('express')
const auth = require('../middlewares/auth')
const Authorization = require('../middlewares/authorization')
const ObservationController = require('../controllers/ObservationController')
const Validation = require('../validations/observationAddValidation')
const UpdateValidation = require('../validations/observationUpdateValidation')

const router = Router()

router.route('/observation/process/:id')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Observation']
    // #swagger.description = 'Endpoint para retornar observações de um processo'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ObservationProcessItem" } }
      return ObservationController.getByProcessId(req, res, next)
    }
  ])

router.route('/observation/:id')
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
      // #swagger.tags = ['Observation']
      // #swagger.description = 'Endpoint para cadastrar uma nova observação em uma phase (passando o id da phase)'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddObservation" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemObservation" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return ObservationController.create(req, res, next)
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
      // #swagger.tags = ['Observation']
      // #swagger.description = 'Endpoint para editar uma observação'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddObservation" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemObservation" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return ObservationController.update(req, res, next)
    }
  ])
  .delete([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Observation']
    // #swagger.description = 'Endpoint para deletar uma observação'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemObservation" } }
      return ObservationController.delete(req, res, next)
    }
  ])

module.exports = router
