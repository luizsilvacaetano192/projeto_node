// const { InvalidArgumentError } = require('../middlewares/errors')
const RdStationIntegrationService = require('../services/RdStationIntegrationService')

class RdIntegration {
  static async convertLead ({ eventName, userData }) {
    const event = {
      event_type: 'CONVERSION',
      event_family: 'CDP',
      payload: {
        conversion_identifier: eventName,
        ...userData
      }
    }

    const rdStationIntegrationService = new RdStationIntegrationService()
    await rdStationIntegrationService.convertLeadIntoEvent(event)
  }
}

module.exports = RdIntegration
