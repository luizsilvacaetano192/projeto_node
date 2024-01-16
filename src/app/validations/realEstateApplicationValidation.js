const { body, validationResult } = require('express-validator')
const Dto = require('../dtos/RealEstateApplicationDTO.js')
// const realEstateModel = require('../models/real-estate')

const validationRules = () => {
  return [
    // Nome da imobiliária
    body('real_estate_name').isLength({ min: 2 }).withMessage('Nome precisa ter ao menos 2 caracteres'),
    // Responsável pela imobiliária
    body('real_estate_liaison').isLength({ min: 2 }).withMessage('Nome precisa ter ao menos 2 caracteres'),
    // Telefone de contato da imobiliária
    body('real_estate_phone').optional().custom(value => {
      if (value.match(/(^(?:0800\)?)\s*?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{3}$)|(^(?:0800|\(?[1-9]{2}\)?)\s*?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$)/)) {
        return true
      }
      return false
    }).withMessage('Número de telefone inválido'),
    // e-mail da imobiliária
    body('real_estate_email').isEmail().withMessage('O email precisa ser válido'),
    // e-mail do solicitante
    body('applicant_email').isEmail().withMessage('O email precisa ser válido'),
    // nome do solicitante
    body('applicant_name').isLength({ min: 2 }).withMessage('Nome precisa ter ao menos 2 caracteres')
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
