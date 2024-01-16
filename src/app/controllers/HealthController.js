const Controller = require('./Controller')

class HealthController extends Controller {
  constructor () {
    super('HealthService')
  }

  async test (req, res, next) {
    try {
      const test = await this.service.testHealth()
      return res.status(200).json(test)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new HealthController()
