const Controller = require('./Controller')

class NotificationController extends Controller {
  constructor () {
    super('NotificationService')
  }

  async getByUserId (req, res, next) {
    try {
      this.service.scope = req.scope

      const userId = req.query.userId

      const response = await this.service.getByUserId(userId)

      return res.status(200).send(response)
    } catch (error) {
      next(error)
    }
  }

  async markAsRead (req, res, next) {
    try {
      this.service.scope = req.scope

      const response = await this.service.update(req.dto.id, { opened: true })

      return res.status(200).send(response)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new NotificationController()
