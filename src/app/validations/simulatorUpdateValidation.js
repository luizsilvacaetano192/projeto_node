const { param, validationResult } = require('express-validator')
const Dto = require('../dtos/simulatorDTO.js')




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

  validate
}
