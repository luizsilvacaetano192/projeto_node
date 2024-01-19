const RdStationIntegrationService = require('../services/RdStationIntegrationService')

class ExternalTokensController {
  async rdCallback (req, res, next) {
    try {
      const { code } = req.query
      const rdStationIntegrationService = new RdStationIntegrationService()
      await rdStationIntegrationService.storeAuthCode(code)
      res.status(200).json({ message: 'codigo Salvo' })
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = new ExternalTokensController()
