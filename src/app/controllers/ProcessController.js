const Controller = require('./Controller')


class ProcessController extends Controller {
  constructor () {
    super('ProcessService')
  }

  async create (req, res, next) {
    try {
      this.service.scope = req.scope
      const details = { detail: req.body.detail, status: req.body.status }
      const item = await this.service.create(req.dto, details)
      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async getProcessByUserId (req, res, next) {
    try {
      this.service.scope = req.scope
      const item = await this.service.getProcessByUserId(req.params.id)
      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async getProcessCountByBuyerId (req, res, next) {
    try {
      this.service.scope = req.scope
      const item = await this.service.getWithFilter({ active: true, buyer: req.params.id })
      return res.status(200).json({ count: item.length })
    } catch (error) {
      next(error)
    }
  }

  async paginateHome (req, res, next) {
    try {
      this.service.scope = req.scope
      const paginatedData = await this.service.paginateHome(req.query)
      return res.status(200).json(paginatedData)
    } catch (error) {
      next(error)
    }
  }
  /*async paginate (req, res, next) {
    try {
      this.service.scope = req.scope

      const { bank, value, phase, status, page, limit, sort } = req.query
      const where = { bank, value, phase, status }
      const options = { limit, page, sort }

      Object.keys(where).forEach((key) => {
        if (typeof where[key] === 'undefined') {
          delete where[key]
        }
      })

      const paginatedData = await this.service.paginate(options, where)

      return res.status(200).json(paginatedData)
    } catch (error) {
      next(error)
    }
  }*/

  async getProcessHistory (req, res, next) {
    try {
      this.service.scope = req.scope

      const result = await this.service.getProcessHistory(req.params.id)
      res.json(result)
      return res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      this.service.scope = req.scope
      const deletedProcess = await this.service.delete(req.params.id)
      return res.status(200).send(deletedProcess)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ProcessController()
