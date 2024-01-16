const { param, validationResult } = require('express-validator')
const Dto = require('../dtos/PhaseDTO.js')
const phaseModel = require('../models/phase')

// A validação do update do user da api legada permite atualizar qualquer dado sem nenhuma checagem
const validationRules = () => {
  return [
    param('id').custom(id => {
      return phaseModel.findOne({ _id: id }).then(phase => {
        if (!phase) {
          // eslint-disable-next-line no-useless-escape
          return Promise.reject(new Error(`Cast to ObjectId failed for value \"${id}\" at path \"_id\" for model \"phases"`))
        }
      })
    }),
    param('type').custom(type => {
      return (['save', 'finish'].indexOf(type) !== -1)
    }).withMessage("Type inválido. Valores possíveis: 'save', 'finish'")
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    try {
      const params = req.body
      if (typeof (req.params.id) !== 'undefined') {
        params.id = req.params.id
      }
      req.dto = new Dto(params).dump()
      return next()
    } catch (error) {
      return next(error)
    }
  }

  return res.status(500).json({ error: true, message: errors.errors[0].msg })
}

module.exports = {
  validationRules,
  validate
}
