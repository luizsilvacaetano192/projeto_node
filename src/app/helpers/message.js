const { InvalidArgumentError } = require('../middlewares/errors')
const MessageMailTrapService = require('../services/MessageMailTrapService')
const MessageSendGridService = require('../services/MessageSendGridService')

/*
  [Refactor]
    Esses caras aqui embaixo e no switch ali no codigo ficam de placeholder
    pra quando implementarmos notificações de plataforma e de push
*/
// const MessagePlatformService = require('../services/MessagePlatformService')
// const MessagePushNotificationService = require('../services/MessagePushNotificationService')

class Message {
  static async send (message) {
    switch (message.type) {
      case ('mail'):
        if (process.env.MAIL_SERVICE === 'mailtrap') {
          const mailService = new MessageMailTrapService()
          const messageObject = { ...message, type: 'mailtrap' }

          // para não enviar emails pelo mailtrap enquanto testando
          if (typeof (process.env.TEST_MAIL) === 'undefined' || process.env.TEST_MAIL === true) {
            return await mailService.send(messageObject)
          }
        } else {
          const mailService = new MessageSendGridService()
          const messageObject = { ...message, type: 'sendgrid' }
          return await mailService.send(messageObject)
        }
        break
      /*
      case ('platform'):
          const MessagePlatformService = new MessagePlatformService()
          MessagePlatformService.send(message)
          break
        case ('push'):
          const MessagePushNotificationService = new MessagePushNotificationService()
          MessagePushNotificationService.send(message)
          break
      */
      default:
        throw new InvalidArgumentError(`Não existe notificação do tipo ${message.type}`)
    }
  }
}

module.exports = Message
