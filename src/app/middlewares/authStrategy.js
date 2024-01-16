const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy
const services = require('../services')
const UserService = new services.UserService()
const { NotAuthorizedError } = require('../middlewares/errors')
const ROLES = require('../helpers/enum/roles.enum')

const tokens = require('../helpers/tokens')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'cpfCnpj',
      passwordField: 'password',
      session: false
    },
    async (cpfCnpj, senha, done) => {
      try {
        const usuario = await UserService.findUserWhenTypeUnknown({ cpfCnpj: cpfCnpj })

        const checkPassword = await usuario.checkPassword(senha)

        if (!checkPassword) {
          throw new NotAuthorizedError()
        }

        done(null, usuario)
      } catch (error) {
        // toda resposta de erro aqui será de usuário não autorizado
        // mesmo se for um caso de usuário não encontrado por exemplo
        done(new NotAuthorizedError())
      }
    }
  )
)

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const id = await tokens.access.check(token)
      let usuario = await UserService.findUserWhenTypeUnknown({ _id: id, active: true })

      usuario = usuario.toObject()
      if (typeof usuario.role === 'undefined') {
        usuario.role = ROLES.REAL_ESTATE
        usuario.isMaster = false
      }
      done(null, usuario, { token })
    } catch (error) {
      done(error)
    }
  })
)
