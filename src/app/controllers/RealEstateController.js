const Controller = require('./Controller')
const RealEstateApplicationsService = require('../services/RealEstateApplicationsService')

class RealEstateController extends Controller {
  constructor () {
    super('RealEstateService')
  }

  async delete (req, res, next) {
    try {
      this.service.scope = req.scope
      const deletedItem = await this.service.delete(req.params.id)
      return res.status(200).send(deletedItem)
    } catch (error) {
      next(error)
    }
  }

  async getWithFilter (req, res, next) {
    try {
      this.service.scope = req.scope

      delete req.where.role
      const item = await this.service.getWithFilter(req.where)

      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async sendApplication (req, res, next) {
    try {
      const realEstateApplicationsService = new RealEstateApplicationsService()
      const item = await realEstateApplicationsService.create(req.dto)

      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new RealEstateController()
