const { body, param, validationResult } = require('express-validator')
const Dto = require('../dtos/UserDTO.js')
const { cpf, cnpj } = require('cpf-cnpj-validator')
const userModel = require('../models/user')

const validationRules = () => {
  return [
    param('role').custom(role => {
      return (['administrator', 'manager', 'seller', 'agent','operational'].indexOf(role) !== -1)
    }).withMessage("Role inválida. Valores possíveis: 'administrator', 'manager', 'seller', 'agent','operational'"),
    body('CPF').custom(userCpf => {
      const isCpfValid = cpf.isValid(userCpf)
      const isCnpjValid = cnpj.isValid(userCpf)
      if (!isCpfValid && !isCnpjValid) {
        return Promise.reject(new Error('Este CPF não é valido'))
      }

      return userModel.findOne({ CPF: userCpf, active: true }).then(user => {
        if (user) {
          return Promise.reject(new Error('CPF já cadastrado'))
        }
      })
    }),
    body('name').not().isEmpty().withMessage('users validation failed: name: Path `name` is required.'),
    body('email').not().isEmpty().withMessage('users validation failed: email: Path `email` is required.')
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

  let statusCode
  switch (errors.errors[0].msg) {
    case 'Este CPF não é valido':
      statusCode = 400
      break
    case 'CPF já cadastrado':
      statusCode = 400
      break
    case
      'users validation failed: name: Path `name` is required.':
      statusCode = 500
      break
    case
      'users validation failed: email: Path `email` is required.':
      statusCode = 500
      break
    default:
      statusCode = 422
      break
  }

  return res.status(statusCode).json({ error: true, message: errors.errors[0].msg })
}

module.exports = {
  validationRules,
  validate
}
