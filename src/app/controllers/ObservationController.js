const Controller = require('./Controller')
const { DateTime } = require('luxon')

class ObservationController extends Controller {
  constructor () {
    super('ObservationService')
  }

  async getByProcessId (req, res, next) {
    try {
      this.service.scope = req.scope
      const observation = await this.service.getByProcessId(req.params.id)
      return res.status(200).send(observation)
    } catch (error) {
      next(error)
    }
  }

  async create (req, res, next) {
    try {
      this.service.scope = req.scope
      req.dto.date = DateTime.now()
      const item = await this.service.create(req.dto)
      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
    try {
      this.service.scope = req.scope
      req.dto.date = DateTime.now()
      super.update(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      this.service.scope = req.scope
      const deletedObservation = await this.service.delete(req.params.id)
      return res.status(200).send(deletedObservation)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ObservationController()
