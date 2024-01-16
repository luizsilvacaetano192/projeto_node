const passport = require('passport')
const tokens = require('../helpers/tokens')
const { NotAuthorizedError } = require('./errors')
const services = require('../services')
const UserService = new services.UserService()
const RealEstateService = new services.RealEstateService()

module.exports = {
  local (req, res, next) {

    passport.authenticate(
      'local',
      { session: false },
      (error, usuario, info) => {
        if (error) {
          return next(error)
        }

        if (!usuario) {
          return next(new NotAuthorizedError())
        }

        req.user = usuario
        req.authenticated = true
        return next()
      }
    )(req, res, next)
  },

  bearer (req, res, next) {
    /*
      Since the legacy API isn't using Bearer strategy
      This change is being implemented so it can accept calls with or without
      The declaration of 'Bearer' at the beginning of the header.
    */
    if (typeof req.headers.authorization !== 'undefined') {
      const explodedToken = req.headers.authorization.split(' ')
      if (explodedToken[0] !== 'Bearer') {
        req.headers.authorization = 'Bearer ' + req.headers.authorization
      }
    }
    passport.authenticate(
      'bearer',
      { session: false },
      (error, usuario, info) => {
        if (error) {
          return next(error)
        }

        if (!usuario) {
          return next(new NotAuthorizedError())
        }

        req.token = info.token
        req.user = usuario
        req.authenticated = true
        return next()
      }
    )(req, res, next)
  },

  async refresh (req, res, next) {
    try {
      const { refreshToken } = req.body
      const id = await tokens.refresh.check(refreshToken)
      await tokens.refresh.invalidate(refreshToken)

      let usuario = await UserService.getById(id)
      if (!usuario) {
        usuario = await RealEstateService.getById(id)
      }
      req.user = usuario
      return next()
    } catch (error) {
      return next(error)
    }
  },

  async checkEmail (req, res, next) {
    try {
      const { token } = req.params
      const id = await tokens.checkEmail.check(token)
      let usuario = await UserService.getById(id)
      if (!usuario) {
        usuario = await RealEstateService.getById(id)
      }
      req.user = usuario
      next()
    } catch (error) {
      return next(error)
    }
  }
}
