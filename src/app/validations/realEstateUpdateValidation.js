const { body, validationResult } = require('express-validator')
const Dto = require('../dtos/RealEstateDTO.js')
const { cnpj } = require('cpf-cnpj-validator')

const validationRules = () => {
  return [
    body('CNPJ').optional().custom(realEstateCnpj => {
      const isCnpjValid = cnpj.isValid(realEstateCnpj)
      if (!isCnpjValid) {
        return Promise.reject(new Error('Este CNPJ não é valido'))
      }
      return true
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
    errors.errors[0].msg === 'Este CNPJ não é valido'
  ) {
    return res.status(500).json({ error: true, message: errors.errors[0].msg })
  }

  const extractedErrors = 'realEstate validation failed: ' + errors.errors[0].param + ': ' + errors.errors[0].msg

  return res.status(500).json({ error: true, message: extractedErrors })
}

module.exports = {
  validationRules,
  validate
}
