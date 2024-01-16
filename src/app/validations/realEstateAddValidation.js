const { body, validationResult } = require('express-validator')
const Dto = require('../dtos/RealEstateDTO.js')
const { cnpj } = require('cpf-cnpj-validator')
const realEstateModel = require('../models/real-estate')

const validationRules = () => {
  return [
    body('name').not().isEmpty().withMessage('Path `name` is required.'),
    body('CNPJ').not().isEmpty().withMessage('Path `CNPJ` is required.'),
    body('CNPJ').custom(realEstateCnpj => {
      const isCnpjValid = cnpj.isValid(realEstateCnpj)
      if (!isCnpjValid) {
        return Promise.reject(new Error('Este CNPJ não é valido'))
      }

      return realEstateModel.findOne({ CNPJ: realEstateCnpj, active: true }).then(realEstate => {
        if (realEstate) {
          return Promise.reject(new Error('CNPJ já cadastrado'))
        }
      })
    }),
    body('email').not().isEmpty().withMessage('Path `email` is required.')
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
    errors.errors[0].msg === 'Este CNPJ não é valido' ||
    errors.errors[0].msg === 'CNPJ já cadastrado'
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
