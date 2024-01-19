const Controller = require('./Controller')
const RealEstateController = require('./RealEstateController')
const tokens = require('../helpers/tokens')
const ROLES = require('../helpers/enum/roles.enum')
const { NotAuthorizedError } = require('../middlewares/errors')

class UserController extends Controller {
  constructor () {
    super('UserService')
  }

  async create (req, res, next) {
    try {
      this.service.scope = req.scope
      const item = await this.service.create(req.dto, req.params.role)
      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async selfCreate (req, res, next) {
    try {
      req.dto.resetPassword = true 
      const item = await this.service.selfCreate(req.dto)
      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async getAll (req, res, next) {
    try {
      this.service.scope = req.scope

      const listAll = await this.service.getAll(req.query, req.where)
      return res.status(200).json(listAll)
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      this.service.scope = req.scope
      const deletedUser = await this.service.delete(req.params.id)
      return res.status(200).send(deletedUser)
    } catch (error) {
      next(error)
    }
  }

  async login (req, res, next) {
    try {
      let user
      if (typeof req.user !== 'undefined') {
        user = req.user
      } else if (typeof req.body.token !== 'undefined') {
        console.log('ta no token')
        const userId = await tokens.access.check(req.body.token)
        console.log('userID',userId)
        user = await this.service.findUserWhenTypeUnknown({ _id: userId })
      } else {
        console.log('ta no erro')
        throw new NotAuthorizedError()
      }

      const accessToken = tokens.access.create(user._id.toString())
      const refreshToken = await tokens.refresh.create(user._id.toString())

      res.status(200).json({
        logged: true,
        token: accessToken,
        refreshToken: refreshToken,
        role: user.role || ROLES.REAL_ESTATE,
        id: user._id,
        name: user.name,
        resetPassword: user.resetPassword
      })
    } catch (error) {
      next(error)
    }
  }

  async logout (req, res, next) {
    try {
      const token = req.token
      await tokens.access.invalidate(token)
      await tokens.refresh.invalidate(req.body.refreshToken)
      res.status(204).json()
    } catch (error) {
      next(error)
    }
  }

  async forgotPassword (req, res, next) {
    try {
      const { cpfCnpj } = req.body
      await this.service.sendForgotPasswordEmail(cpfCnpj)

      res.status(204).json()
    } catch (error) {
      next(error)
    }
  }

  async changePassword (req, res, next) {
    const userToChange = await this.service.findUserWhenTypeUnknown({ _id: req.dto.id })

    // se role = undefined, é realEstate e portanto chamamos o update do controller de realEstate
    if (typeof userToChange.role === 'undefined') {
      req.dto.resetPassword = true 
      await RealEstateController.update(req, res, next)
    } else {
      req.dto.resetPassword = true 
      await super.update(req, res, next)
    }
  }

  async changeNotificationToken (req, res, next) {
    try {
      console.log('req.userId', req.dto)
      /* let user = await this.service.getById(req.body.userId)
      console.log('fdfdfd', user)
      user = user.toObject()
      console.log('dfdf33333', user)
      user.notificationToken = req.body.notificationToken
      console.log('user.notificationToken', user.notificationToken)
      console.log('dsdfere', user) */

      const a = await this.service.update(req.body.userId, { notificationToken: req.body.notificationToken })
      console.log('retorno grava', a)
      res.status(200).json({ message: 'foi' })
    } catch (error) {
      res.status(400).json({ message: 'nao foi' })
    }
  }

  async changePasswordWithToken (req, res, next) {
    try {
      await this.service.changePasswordWithToken(req.dto)

      res.status(200).json({ message: 'Senha alterada' })
    } catch (error) {
      res.status(400).json({ message: 'Não foi possível alterar a senha' })
    }
  }
}

module.exports = new UserController()
