const { param, validationResult } = require('express-validator')
const Dto = require('../dtos/UserDTO.js')
const userModel = require('../models/user')

// A validação do update do user da api legada permite atualizar qualquer dado sem nenhuma checagem
const validationRules = () => {
  return [
    param('id').custom(id => {
      return userModel.findOne({ _id: id }).then(user => {
        if (!user) {
          // eslint-disable-next-line no-useless-escape
          return Promise.reject(new Error(`Cast to ObjectId failed for value \"${id}\" at path \"_id\" for model \"users"`))
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

  return res.status(500).json({ error: true, message: errors.errors[0].msg })
}

module.exports = {
  validationRules,
  validate
}
