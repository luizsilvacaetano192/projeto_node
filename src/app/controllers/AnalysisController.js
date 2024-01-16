const Controller = require('./Controller')

class AnalysisController extends Controller {
  constructor () {
    super('AnalysisService')
  }

  async create (req, res, next) {
    try {
      this.service.scope = req.scope
      const item = await this.service.create(req.dto)
      return res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      this.service.scope = req.scope
      const deletedAnalysis = await this.service.delete(req.params.id)
      return res.status(200).send(deletedAnalysis)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AnalysisController()
