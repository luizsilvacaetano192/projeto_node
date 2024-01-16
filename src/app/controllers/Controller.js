const services = require('../services')

class Controller {
  constructor (service) {
    this.service = new services[service]()
  }

  async paginate (req, res, next) {
    try {
      this.service.scope = req.scope

      const paginatedData = await this.service.paginate(req.query)
      console.log('paginatedData',paginatedData)
      return res.status(200).json(paginatedData)
    } catch (error) {
      next(error)
    }
  }

  async get (req, res, next) {
    try {
      this.service.scope = req.scope
      const item = await this.service.getById(req.params.id)

      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async getWithFilter (req, res, next) {
    try {
      this.service.scope = req.scope
      const item = await this.service.getWithFilter(req.where)

      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async create (req, res, next) {
  
    try {
      this.service.scope = req.scope
      const item = await this.service.create(req.dto)
      return res.status(201).json(item)
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
    try {
      this.service.scope = req.scope
      const item = await this.service.update(req.dto.id, req.dto)
      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      this.service.scope = req.scope
      await this.service.delete(req.params.id)
      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controller
