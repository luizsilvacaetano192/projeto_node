const EventBus = require('../helpers/eventBus')
const Message = require('../helpers/message')
const { InternalServerError } = require('../middlewares/errors')

let isInitialized = false

module.exports = {
  init () {
    if (!isInitialized) {
      isInitialized = true
      EventBus.createTopic('message')

      EventBus.subscribe('message', async (message) => {
        return await Message.send(message)
      })
    } else {
      throw new InternalServerError('Internal Server Error: MessageHandler is being initializing twice.')
    }
  }
}
