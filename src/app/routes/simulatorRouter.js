const { Router } = require('express')
//const auth = require('../middlewares/auth')
///const Authorization = require('../middlewares/authorization')
const SimulatorController = require('../controllers/SimulatorController')


const router = Router()

router.route('/calculed/')
  .get([

    //auth.bearer,
    //(req, res, next) => {
    //  console.log('entrou aq')
    //  Authorization.authorize(req, res, next)
    //},
    (req, res, next) => {
    // #swagger.tags = ['Notification']
    // #swagger.description = 'Endpoint para retornar todas as notificações de um usuário'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/NotificationList" } }
    return SimulatorController.calculed(req, res, next)
    }
  ])


  module.exports = router