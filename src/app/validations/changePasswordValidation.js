const { body, validationResult } = require('express-validator')
const UserDto = require('../dtos/UserDTO.js')
const RealEstateDto = require('../dtos/RealEstateDTO.js')
const UserService = require('../services/UserService')
const { NotFoundError } = require('../middlewares/errors')

const validationRules = () => {
  /*
      [Refactor] - Nota para conferir no review se estas decisões estão OK:

      Todas as regras aqui são inexistentes na API legada

      Lá não ha regra. Se não encontrar o id vai retornar erro do mongoose.
      Se quiser setar o novo password para uma string vazia vc consegue.

      Como este é um caso que não me parece causar falta de acesso para usuarios atuais
      seria uma regra que entraria em vigor a partir da implementação do refactor.
  */

  return [
    // Verifica se é um id de user ou realEstate valido
    body('id').custom(id => {
      const userService = new UserService()
      return userService.findUserWhenTypeUnknown({ _id: id })
        .then((data) => {
          if (!data) {
            return Promise.reject(new NotFoundError(`usuario com id ${id}`))
          }
        })
        .catch(() => {
          return Promise.reject(new NotFoundError(`usuario com id ${id}`))
        })
    }),
    // Estabelece algumas regras para password seguro
    body('password').custom(value => {
      if (value.match(/^(?=.*[a-z])(?=.*[A-Z])((?=.*\d)|(?=.*[@$!%*?&]))[A-Za-z\d@$!%*?&]{8,}$/)) {
        return true
      }
      return false
    })
      .withMessage('A senha deve conter 8 caracteres e ao menos uma letra maiúscula, uma letra minúscula e um número ou caractere especial')
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    try {
      const params = {
        id: req.body.id,
        password: req.body.password
      }

      if (req.user.role === 'REAL_ESTATE') {
        req.dto = new RealEstateDto(params).dump()
      } else {
        req.dto = new UserDto(params).dump()
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
