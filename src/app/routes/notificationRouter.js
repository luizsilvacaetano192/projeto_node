const { Router } = require('express')
const auth = require('../middlewares/auth')
const Authorization = require('../middlewares/authorization')
const NotificationController = require('../controllers/NotificationController')
const UpdateValidation = require('../validations/notificationUpdateValidation')

const router = Router()

router.route('/notification')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Notification']
    // #swagger.description = 'Endpoint para retornar todas as notificações de um usuário'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/NotificationList" } }
      return NotificationController.getByUserId(req, res, next)
    }
  ])

router.route('/notification/:id')
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
      // #swagger.tags = ['Notification']
      // #swagger.description = 'Endpoint para marcar uma notificação como aberta'
      // #swagger.security = [{"jwt": []}]
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/NotificationItem" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return NotificationController.markAsRead(req, res, next)
    }
  ])

module.exports = router
