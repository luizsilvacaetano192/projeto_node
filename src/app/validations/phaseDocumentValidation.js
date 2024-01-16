const { param, body, query, validationResult } = require('express-validator')
const phaseModel = require('../models/phase')

// A validação do update do user da api legada permite atualizar qualquer dado sem nenhuma checagem
const validationRules = () => {
  return [
    param('phaseId').custom(async (id) => {
      try {
        await phaseModel.findOne({ _id: id })
      } catch (e) {
        // eslint-disable-next-line no-useless-escape
        return Promise.reject(new Error(`Cast to ObjectId failed for value \"${id}\" at path \"_id\" for model \"phases"`))
      }
    }),
    body('downloaded').custom(type => {
      return ([true, false].indexOf(type) !== -1)
    }).withMessage('downloaded inválido. Valores possíveis: true or false'),
    query('fieldName').custom((fieldName, { req }) => {
      const phaseId = req.params.phaseId
      return phaseModel.findOne({ _id: phaseId }).then(phase => {
        if (phase.docs.findIndex((doc) => doc.fieldName === fieldName) === -1) {
          return Promise.reject(new Error("Cannot set property 'downloaded' of undefined"))
        }
      })
    })
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)

  // In this validator we don't populate a DTO, it goes to controller next
  if (errors.isEmpty()) {
    return next()
  }

  return res.status(500).json({ error: true, message: errors.errors[0].msg })
}

module.exports = {
  validationRules,
  validate
}
