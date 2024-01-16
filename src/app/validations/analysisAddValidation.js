const { body, validationResult } = require('express-validator')
const Dto = require('../dtos/AnalysisDTO.js')
const { cpf } = require('cpf-cnpj-validator')
const userModel = require('../models/user')
const USER_ROLES = require('../helpers/enum/roles.enum')

const validationRules = () => {
  return [
    body('buyer').not().isEmpty().withMessage("Cannot destructure property `CPF` of 'undefined' or 'null'."),
    body('buyer.CPF').custom(buyerCpf => {
      const isCpfValid = cpf.isValid(buyerCpf)
      if (!isCpfValid) {
        return Promise.reject(new Error('Favor informar um CPF válido'))
      }
      return true
    }),
    body('requestUserId').not().isEmpty().withMessage("Cannot read property 'role' of null"),
    body('requestUserId').custom(userId => {
      return userModel.findById(userId).then(requestUser => {
        if (![USER_ROLES.AGENT, USER_ROLES.MANAGER].includes(requestUser.role)) {
          return Promise.reject(new Error('Somente corretores e gerentes podem enviar novas análises'))
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

  if (
    errors.errors[0].param === 'buyer' ||
    errors.errors[0].msg === "Cannot read property 'role' of null"
  ) {
    return res.status(500).json({ error: true, message: errors.errors[0].msg })
  }

  return res.status(400).json({ error: true, message: errors.errors[0].msg })
}

module.exports = {
  validationRules,
  validate
}
