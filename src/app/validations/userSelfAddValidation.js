const { body, validationResult } = require('express-validator')
const Dto = require('../dtos/UserDTO.js')
const { cpf, cnpj } = require('cpf-cnpj-validator')
const userModel = require('../models/user')
const realEstateModel = require('../models/real-estate')

const validationRules = () => {
  return [
    body('name').isLength({ min: 2 }).withMessage('Nome precisa ter ao menos 2 caracteres'),
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
    body('email').isEmail().withMessage('O email precisa ser válido'),
    body('password').custom(value => {
      if (value.match(/^(?=.*[a-z])(?=.*[A-Z])((?=.*\d)|(?=.*[@$!%*?&]))[A-Za-z\d@$!%*?&]{8,}$/)) {
        return true
      }
      return false
    }).withMessage('A senha deve conter 8 caracteres e ao menos uma letra maiúscula, uma letra minúscula e um número ou caractere especial'),
    body('phone').optional().custom(value => {
      if (value.match(/(^(?:0800\)?)\s*?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{3}$)|(^(?:0800|\(?[1-9]{2}\)?)\s*?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$)/)) {
        return true
      }
      return false
    }).withMessage('Número de telefone inválido'),
    body('birthDate').optional().isISO8601().withMessage('birthdate precisa ser valido e no formato [YYYY-MM-DD]'),
    body('role').custom(role => {
      role = role.toUpperCase()
      return (['MANAGER', 'AGENT'].indexOf(role) !== -1)
    }).withMessage("Role inválida. Valores possíveis: 'manager', 'agent'"),
    body('realEstate').custom(realEstateId => {
      return realEstateModel.findOne({ _id: realEstateId, active: true }).then(realEstate => {
        if (!realEstate) {
          return Promise.reject(new Error('realEstate não encontrada'))
        }
      })
    })
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

  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({ errors: extractedErrors })
}

module.exports = {
  validationRules,
  validate
}
