const { validationResult } = require('express-validator')
const Dto = require('../dtos/UserRegisterDTO.js')

const validationRules = () => {
  return [
    // param('id').custom(id => {
    //   return phaseModel.findOne({ _id: id }).then(phase => {
    //     if (!phase) {
    //       // eslint-disable-next-line no-useless-escape
    //       return Promise.reject(new Error(`Cast to ObjectId failed for value \"${id}\" at path \"_id\" for model \"phases"`))
    //     }
    //   })
    // })
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

  //   const extractedErrors = []
  //   errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  //   return res.status(422).json({ errors: extractedErrors })
  return res.status(500).json({ error: true, message: errors.errors[0].msg })
}

module.exports = {
  validationRules,
  validate
}
