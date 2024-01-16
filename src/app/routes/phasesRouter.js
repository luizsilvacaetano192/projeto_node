const { Router } = require('express')
const auth = require('../middlewares/auth')
const Authorization = require('../middlewares/authorization')
const PhaseController = require('../controllers/PhaseController')
const PhaseUpdateValidation = require('../validations/phaseUpdateValidation')
const PhaseDocumentValidation = require('../validations/phaseDocumentValidation')
const multer = require('multer')

const router = Router()
const upload = multer()

router.route('/phase/:id')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Phase']
    // #swagger.description = 'Endpoint para retornar uma phase por id'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemPhase" } }
      return PhaseController.get(req, res, next)
    }
  ])

router.route('/phase/:id/:type')
  .put([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    PhaseUpdateValidation.validationRules(),
    (req, res, next) => {
      PhaseUpdateValidation.validate(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['Phase']
      // #swagger.description = 'Endpoint para fazer update de uma phase'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/EditPhase" } } */
      // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemPhase" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return PhaseController.update(req, res, next)
    }
  ])

router.route('/upload/process/phase/:id')
  .post([
    auth.bearer,
    (req, res, next) => {
   
      Authorization.authorize(req, res, next)
      
    },
    upload.array('archives', 20),
    (req, res, next) => {
     
     
      // #swagger.tags = ['Phase']
      // #swagger.description = 'Endpoint para Fazer upload de um document'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddBank" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemBank" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }

      return PhaseController.upload(req, res, next)
    }
  ])

router.route('/download-document/:phaseId')
  .put([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    PhaseDocumentValidation.validationRules(),
    (req, res, next) => {
      PhaseDocumentValidation.validate(req, res, next)
    },
    (req, res, next) => {

 
      // #swagger.tags = ['Phase']
      // #swagger.description = 'Endpoint para atualizar flag downloaded de arquivo de phase'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/EditPhaseDocument" } } */
      // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/ItemPhase" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return PhaseController.setDownloaded(req, res, next)
    }
  ])

module.exports = router
