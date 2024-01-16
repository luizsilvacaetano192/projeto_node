const { param, body, validationResult } = require('express-validator')
const Dto = require('../dtos/ObservationDTO.js')
const phaseModel = require('../models/phase')

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
    body('description').not().isEmpty().withMessage('Path `description` is required.')
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

  if (errors.errors[0].param === 'id') {
    return res.status(500).json({ error: true, message: errors.errors[0].msg })
  }

  const extractedErrors = 'observations validation failed: ' + errors.array().map((err, index) => {
    if (index === 0) {
      return err.param + ': ' + err.msg
    }
    return ' ' + err.param + ': ' + err.msg
  })
  return res.status(500).json({ error: true, message: extractedErrors })
}

module.exports = {
  validationRules,
  validate
}
