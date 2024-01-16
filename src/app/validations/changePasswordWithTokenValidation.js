const { body, validationResult } = require('express-validator')

const validationRules = () => {
  return [
    body('code').isLength({ min: 2 }),
    body('password').custom(value => {
      if (value.match(/^(?=.*[a-z])(?=.*[A-Z])((?=.*\d)|(?=.*[@$!%*?&]))[A-Za-z\d@$!%*?&]{8,}$/)) {
        return true
      }
      return false
    }).withMessage('A senha deve conter 8 caracteres e ao menos uma letra maiúscula, uma letra minúscula e um número ou caractere especial')
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    try {
      req.dto = {
        token: req.body.code,
        password: req.body.password
      }
      return next()
    } catch (error) {
      return next(error)
    }
  }

  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({ errors: extractedErrors })
}

module.exports = {
  validationRules,
  validate
}
