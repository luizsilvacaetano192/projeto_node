const MessageHandler = require('./messageHandler')
const LeadConversionHandler = require('./leadConversionHandler')

module.exports = {
  init () {
    MessageHandler.init()
    LeadConversionHandler.init()
  }
}
