const { body, validationResult } = require('express-validator')
const Dto = require('../dtos/BankDTO.js')

const validationRules = () => {
  return [
    body('commission').not().isEmpty().withMessage('Path `commission` is required.'),
    body('name').not().isEmpty().withMessage('Path `name` is required.')
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

  const extractedErrors = 'banks validation failed: ' + errors.array().map((err, index) => {
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
