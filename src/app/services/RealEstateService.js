const Services = require('./Services')
const fs = require('fs')
const EventBus = require('../helpers/eventBus')
const { NotAuthorizedError, InternalServerError } = require('../middlewares/errors')

class RealEstateService extends Services {
  constructor () {
    super(
      'realestates',
      'Real Estate'
    )
  }

  async create (data) {
    const password = Math.random().toString(36).substring(4)

    data.password = password
    const realEstate = await super.create(data)

    await this.sendNewUserPasswordEmail(realEstate.name, realEstate.email, password)

    return realEstate
  }

  /*
    [Refactor] - Nota para conferir no review se esta decisão é OK:

      Adicionei aqui uma regra de permissionamento inexistente na API legada.
  */

  async update (id, data) {
    //  Permite o update apenas caso o usuário seja superUser
    //  ou se for uma requisição de alteração partindo do proprio usuário
    //  ou se for uma alteração com token enviado por email
    if (!this.scope.hasFullPermission && (this.scope.userRef.toString() !== id)) {
      throw new NotAuthorizedError()
    }

    return await super.update(id, data)
  }

  /*
    [Refactor] - Nota para conferir no review se esta decisão é OK:

      Adicionei aqui uma regra de permissionamento inexistente na API legada.
  */
  async delete (id) {
    // Somente que um Administrador pode deletar imobiliarias.
    if (this.scope.role !== 'ADMINISTRATOR') {
      throw new NotAuthorizedError()
    }

    return await super.delete(id)
  }

  async sendNewUserPasswordEmail (userName, userEmail, password) {
    const topic = 'message'

    fs.readFile('./src/infra/mailTemplates/newUserPasswordMailTemplate.html', 'utf8', async function (err, template) {
      if (err) {
        throw new InternalServerError('InternalServerError: Não foi possivel realizar o envio do email')
      }

      let messageContent = template.replace('%USERNAME%', userName)
      messageContent = messageContent.replace(/%PASSWORD%/g, password)

      const message = {
        type: 'mail',
        to: userEmail,
        from: `Test Server < ${process.env.EMAIL_FROM} >`,
        subject: 'Bem vindo a Concede Crédito Imobiliário',
        message: messageContent
      }

      EventBus.publish(
        topic,
        message
      )
    })
  }
}

module.exports = RealEstateService
