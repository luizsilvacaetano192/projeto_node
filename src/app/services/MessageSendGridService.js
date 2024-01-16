const sgMail = require('@sendgrid/mail')
const Services = require('./Services')
const { InvalidArgumentError } = require('../middlewares/errors')

class MessageSendGridService extends Services {
  constructor () {
    super(
      'messages',
      'Mensagem'
    )

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  }

  /**
   * O método validateMessage valida se o objeto recebido contem os campos necessarios e com dados e caso não passe na validação lança o primeiro erro que encontrar
   * @params {object} message - Objeto contendo dados da message
   * @throws InvalidArgumentError
   */
  validateMessage (message) {
    const schema = {
      type: value => value !== undefined && value.length > 0,
      to: value => value !== undefined && value.length > 0,
      from: value => value !== undefined && value.length > 0,
      subject: value => value !== undefined && value.length > 0,
      message: value => value !== undefined && value.length > 0
    }

    const validate = (object, schema) => Object
      .keys(schema)
      .filter(key => !schema[key](object[key]))
      .map(key => new InvalidArgumentError(`${key} is invalid`))

    const errors = validate(message, schema)

    if (errors.length > 0) {
      throw errors[0]
    }
  }

  /**
   * O método parseMessageToSendGrid recebe um objeto de message e traduz para o formato esperado pelo SendGrid
   * @params {object} message - Objeto contendo dados da message
   * @return {object} - o objeto traduzido para ser utilizado no envio ao SendGrid
   */
  parseMessageToSendGrid (message) {
    let sanitizedText = message.message.replace(/<[^>]+>/g, '')
    sanitizedText = sanitizedText.replace(/&nbsp;/g, '')

    const pieces = sanitizedText.split('\n')

    const output = []

    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].trim().length > 0) {
        output.push(pieces[i].trim())
      }
    }

    const text = output.join('\n')

    return {
      to: message.to,
      from: message.from,
      subject: message.subject,
      text: text,
      html: message.message
    }
  }

  /**
   * O método sendMailAndReturnPayload faz o envio da message traduzida ao mailtrap e retorna uma payload
   * @params {object} mail - Objeto contendo dados da message
   * @return {object} - Payload de retorno da operação de envio ao MailTrap
   */
  async sendMailAndReturnPayload (mail) {
    try {
      const mailResponse = await sgMail.send(mail)
      return mailResponse
    } catch (error) {
      console.error(error.response.body)
      return error
    }
  }

  async send (message) {
    this.validateMessage(message)
    const newMessage = await this.create(message)

    const mail = this.parseMessageToSendGrid(message)

    const mailPayload = await this.sendMailAndReturnPayload(mail)
    const payload = JSON.stringify(mailPayload)

    return this.update(newMessage.id, { response_payload: payload })
  }
}

module.exports = MessageSendGridService
