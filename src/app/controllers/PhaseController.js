const Controller = require('./Controller')

class PhaseController extends Controller {
  constructor () {
    super('PhaseService')
  }

  async get (req, res, next) {
    try {
      this.service.scope = req.scope
      const phaseItem = await this.service.getByPhaseId(req.params.id)
      return res.status(200).send(phaseItem)
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
    try {
      this.service.scope = req.scope
      const phaseItem = await this.service.update(req.params.id, req.params.type, req.dto)
      return res.status(200).send(phaseItem)
    } catch (error) {
      next(error)
    }
  }

  async upload (req, res, next) {
    try {
      this.service.scope = req.scope

      const params = {
        phaseId: req.params.id,
        processId: req.body.idProcess,
        complementar: req.body.complementar,
        fieldName: req.body.fieldName,
        files: req.files
      }

      await this.service.upload(params)

      return res.status(200).send()
    } catch (error) {
      next(error)
    }
  }

  async setDownloaded (req, res, next) {
    try {
      this.service.scope = req.scope

      const phaseItem = await this.service.setDownloaded(req.params.phaseId, req.query.fieldName, req.body.downloaded)
      return res.status(200).send(phaseItem)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new PhaseController()
