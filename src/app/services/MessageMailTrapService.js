const nodemailer = require('nodemailer')
const mailTrapConfig = require('../../config/mailTrap')
const Services = require('./Services')
const { InvalidArgumentError } = require('../middlewares/errors')

/**
 * A class MessageMailTrapService é a classe para o tratamento de envios de emails em ambiente de desenvolvimento
 */
class MessageMailTrapService extends Services {
  /**
   * O Construtor da classe MessageMailTrapService inicializa o transporter do nodemailer com as credenciais do ambiente
   */
  constructor () {
    super(
      'messages',
      'Mensagem'
    )

    this.transporter = nodemailer.createTransport(mailTrapConfig)
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
   * O método parseMessageToMailTrap recebe um objeto de message e traduz para o formato esperado pelo MailTrap
   * @params {object} message - Objeto contendo dados da message
   * @return {object} - o objeto traduzido para ser utilizado no envio ao MailTrap
   */
  parseMessageToMailTrap (message) {
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
      from: message.from,
      to: message.to,
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
    const mailResponse = new Promise((resolve, reject) => {
      this.transporter.sendMail(mail, (error, info) => {
        if (error) {
          return reject(error)
        }
        return resolve(info)
      })
    })
    return mailResponse
  }

  /**
   * O método send agrega todas as operações necessárias para ao receber uma message envia-la ao MailTrap e retornar o registro armazenado no banco já com sua payload
   * @params {object} message - Objeto contendo dados de message
   * @return {object} - O registro de message do banco atualizado
   */
  async send (message) {
    this.validateMessage(message)
    const newMessage = await this.create(message)

    const mail = this.parseMessageToMailTrap(message)
    const mailPayload = await this.sendMailAndReturnPayload(mail)
    const payload = JSON.stringify(mailPayload)

    return this.update(newMessage.id, { response_payload: payload })
  }
}

module.exports = MessageMailTrapService
