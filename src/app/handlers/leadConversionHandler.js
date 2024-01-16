const EventBus = require('../helpers/eventBus')
const RdIntegration = require('../helpers/rdIntegration')
const { InternalServerError } = require('../middlewares/errors')

let isInitialized = false

module.exports = {
  init () {
    if (!isInitialized) {
      isInitialized = true
      EventBus.createTopic('leadConversion')

      EventBus.subscribe('leadConversion', async (payload) => {
        return await RdIntegration.convertLead(payload)
      })
    } else {
      throw new InternalServerError('Internal Server Error: LeadConversionHandler is being initializing twice.')
    }
  }
}
