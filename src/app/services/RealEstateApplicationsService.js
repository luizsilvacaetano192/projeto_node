const Services = require('./Services')
const fs = require('fs')
const EventBus = require('../helpers/eventBus')
const { InternalServerError } = require('../middlewares/errors')
const UserService = require('./UserService')

class RealEstateApplicationsService extends Services {
  constructor () {
    super(
      'realestateapplications',
      'Real Estate Application'
    )
  }

  async create (data) {
    const userService = new UserService()
    const realEstateApplication = await super.create(data)

    // get admin master users to send email
    const userAdmins = await userService.getWithFilter({
      active: true,
      role: 'ADMINISTRATOR',
      isMaster: true
    })

    userAdmins.forEach(userAdmin => {
      this.sendNewRealEstateApplicationEmail(userAdmin.name, userAdmin.email, realEstateApplication)
    })

    return realEstateApplication
  }

  async sendNewRealEstateApplicationEmail (userName, userEmail, realEstateData) {
    const topic = 'message'

    // Criar template de solicitação de inclusão de imobiliária
    fs.readFile('./src/infra/mailTemplates/realEstateApplicationTemplate.html', 'utf8', async function (err, template) {
      if (err) {
        throw new InternalServerError('InternalServerError: Não foi possivel realizar o envio do email')
      }

      let messageContent = template.replace('%USERNAME%', userName)
      messageContent = messageContent.replace(/%REALESTATENAME%/g, realEstateData.real_estate_name)
      messageContent = messageContent.replace(/%REALESTATELIAISON%/g, realEstateData.real_estate_liaison)
      messageContent = messageContent.replace(/%REALESTATEPHONE%/g, realEstateData.real_estate_phone)
      messageContent = messageContent.replace(/%REALESTATEEMAIL%/g, realEstateData.real_estate_email)
      messageContent = messageContent.replace(/%APPLICANTNAME%/g, realEstateData.applicant_email)
      messageContent = messageContent.replace(/%APPLICANTEMAIL%/g, realEstateData.applicant_name)

      const message = {
        type: 'mail',
        to: userEmail,
        from: `Test Server < ${process.env.EMAIL_FROM} >`,
        subject: 'Há uma nova solicitação cadastral de Imobiliária',
        message: messageContent
      }

      EventBus.publish(
        topic,
        message
      )
    })
  }
}

module.exports = RealEstateApplicationsService
