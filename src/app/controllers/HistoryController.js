const Controller = require('./Controller')
const { DateTime } = require('luxon')

class HistoryController extends Controller {
  constructor () {
    super('HistoryService')
  }

  async saveUserRegister (req, res, next) {
    try {
      this.service.scope = req.scope
      req.dto.date = DateTime.now()
      const userRegister = await this.service.saveUserRegister(req.params.id, req.dto)
      return res.status(200).send(userRegister)
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
    try {
      this.service.scope = req.scope
      const userRegister = await this.service.updateUserRegister(req.params.id, req.dto)
      return res.status(200).send(userRegister)
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      this.service.scope = req.scope
      const userRegister = await this.service.deleteUserRegister(req.params.id)
      return res.status(200).send(userRegister)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new HistoryController()
