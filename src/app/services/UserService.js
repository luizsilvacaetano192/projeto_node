const Services = require('./Services')
const User = require('../models/user')
const  RealEstate = require('../models/real-estate')
const fs = require('fs')
const EventBus = require('../helpers/eventBus')
const tokens = require('../helpers/tokens')
const ROLES = require('../helpers/enum/roles.enum')
const RealEstateService = require('./RealEstateService')
const { cpf, cnpj } = require('cpf-cnpj-validator')
const { NotAuthorizedError, ForbiddenError, InternalServerError, BadRequestException } = require('../middlewares/errors')

function generateLink (route, token) {
  const baseURL = process.env.BASE_URL
  return `${baseURL}${route}${token}`
}

class UserService extends Services {
  constructor () {
    super(
      'users',
      'User'
    )
  }

  async create (data, role) {
   
    if (
      (role === 'administrator' || role === 'seller') &&
        !this.scope.hasFullPermission
    ) {
      throw new NotAuthorizedError()
    }

    // Gera um password random na criação do usuário que será enviado por email
    const password = Math.random().toString(36).substring(4)
    data.password = password
    data.role = role.toUpperCase()
    data.active = true

    const newUser = await super.create(data)

    await this.sendNewUserPasswordEmail(newUser.name, newUser.email, data.password)

    const populatedNewUser = await User.findOne({ _id: newUser._id }).populate('realEstate')

    this.convertLeadIntoEvent(populatedNewUser)

    return populatedNewUser
  }

  async selfCreate (data) {
    data.resetPassword = true
    const newUser = await super.create(data)

    const populatedNewUser = await User.findOne({ _id: newUser._id }).populate('realEstate')

    this.convertLeadIntoEvent(populatedNewUser)

    return populatedNewUser
  }

  async getById (id) {
    return await User.findById(id).populate('realEstate')
  }

  async getAll (options, where = {}) {
    let roleOptions = []
    let realEstateName = []
    if (where.role === '') { roleOptions = [ROLES.ADMINISTRATOR, ROLES.AGENT, ROLES.MANAGER,ROLES.OPERATIONAL] } else roleOptions = [where.role]
    realEstateName = options.realEstate
    const realEstateService = new RealEstateService()
    let realEstate ;
    console.log('realEstateName',realEstateName)
    if(realEstateName === "AUTONOMOUS"){
      realEstate = await realEstateService.findOne({ name: 'Autônomo' });
    }
    if(realEstateName === "INDICATION"){
      realEstate = await realEstateService.findOne({ name: 'INDICAÇÃO' });
    }



   console.log('realEstate',realEstate)

   if(realEstateName == 'AUTONOMOUS'){

    return User.paginate(
      {
        active: true,
        name: where.name,
        role: { $in: roleOptions },
        realEstate : {$in : [realEstate,  null]},

        
      },
      {
        ...options,
        populate: 'realEstate'
      }
    )

   }
   else if(realEstateName == 'INDICATION'){
    return User.paginate(
      {
        active: true,
        name: where.name,
        role: { $in: roleOptions },
        realEstate : {$in : [realEstate,  null]},
      },
      {
        ...options,
        populate: 'realEstate'
      }
    )

   }
   else if(realEstateName == 'REALESTATE'){
    let realEstateINDICATION = await realEstateService.findOne({ name: 'INDICAÇÃO' }); 
    let realEstateAUTONOMOUS = await realEstateService.findOne({ name: 'Autônomo' });
    return User.paginate(
      {
        active: true,
        name: where.name,
        role: { $in: roleOptions },
        realEstate : {$ne : realEstateINDICATION },
        realEstate : {$ne : realEstateAUTONOMOUS },
        
      },
      {
        ...options,
        populate: 'realEstate'
      }
    )

   }
    
   else {
  
    return User.paginate(
      {
        active: true,
        name: where.name,
        role: { $in: roleOptions },
     
      },
      {
        ...options,
        populate: 'realEstate'
      }
    )

   }
  }

  /*
    [Refactor] - Nota para conferir no review se esta decisão é OK:

      Adicionei aqui uma regra de permissionamento inexistente na API legada.
  */

  async update (id, data) {
    //  Permite o update apenas caso o usuário seja superUser
    //  ou se for uma requisição de alteração partindo do proprio usuário
    /* if (!this.scope.hasFullPermission && (this.scope.userRef.toString() !== id)) {
      throw new NotAuthorizedError()
    } */
    return await super.update(id, data)
  }

  async delete (id) {
    if (String(id) === String(this.scope.userRef)) {
      throw new ForbiddenError()
    }

    const userToDelete = await super.getById(id)
    if (
      userToDelete.role === ROLES.ADMINISTRATOR &&
      !this.scope.hasFullPermission
    ) {
      throw new NotAuthorizedError()
    }

    return await super.delete(id)
  }

  /*
    Há 2 tipos de entidades que podem logar no sistema
    Usuário e RealEstate

    UserService.findUserWhenTypeUnknown
    confere qual é o tipo que está tentando logar
    através do CPF ou CNPJ enviado
  */
  async findUserWhenTypeUnknown (where) {
    const realEstateService = new RealEstateService()
    let usuario

    const { cpfCnpj, ...restWhere } = where

    if (typeof cpfCnpj !== 'undefined') {
      const isCpfValid = cpf.isValid(cpfCnpj)
      const isCnpjValid = cnpj.isValid(cpfCnpj)

      if (!isCpfValid && !isCnpjValid) {
        throw new BadRequestException('O numero do documento passado é inválido')
      }

      if (isCpfValid) {
        usuario = await this.findOne({ CPF: cpfCnpj, ...restWhere })
        return usuario
      }

      if (isCnpjValid) {
        usuario = await realEstateService.findOne({ CNPJ: cpfCnpj, ...restWhere })
        return usuario
      }
    }

    usuario = await this.findOne(where)
    if (!usuario) {
      usuario = await realEstateService.findOne(where)
    }

    return usuario
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

  async sendForgotPasswordEmail (cpfCnpj) {
    
    const usuario = await this.findUserWhenTypeUnknown({ cpfCnpj: cpfCnpj, active: true })

    console.log('usuario',usuario)

    const topic = 'message'

    fs.readFile('./src/infra/mailTemplates/resetPasswordMailTemplate.html', 'utf8', async function (err, template) {
      if (err) {
        throw new InternalServerError('InternalServerError: Não foi possivel realizar o envio do email')
      }
      const token = await tokens.passwordReset.create(usuario._id.toString())
      
      console.log('token',token)
      console.log('usuario.email',usuario.email)
      // const resetLink = generateLink('/usuarios/redefine-senha/', token)
      let messageContent = template.replace('%USERNAME%', usuario.name)
      messageContent = messageContent.replace(/%token%/g, token)
      const message = {
        type: 'mail',
        to: usuario.email,
        from: `Sistema Concede < ${process.env.EMAIL_FROM} >`,
        subject: 'Redefinição da sua senha na Concede Crédito Imobiliário',
        message: messageContent
      }

      EventBus.publish(
        topic,
        message
      )

   

      return token
    })
  }

  async changePasswordWithToken (dto) {
    const id = await tokens.passwordReset.check(dto.token)
    await tokens.passwordReset.invalidate(dto.token)

    const user = await this.findUserWhenTypeUnknown({ _id: id })

    if (user) {
      if (typeof user.role === 'undefined') {
        const realEstateService = new RealEstateService()
        realEstateService.scope = { userRef: user.id }
        return await realEstateService.update(user.id, { password: dto.password })
      }
    }

    return await super.update(user.id, { password: dto.password })
  }

  async convertLeadIntoEvent (user) {
    const topic = 'leadConversion'

    let eventName
    let isCpfValid = false
    let isCnpjValid = false

    switch (user.role) {
      case 'SELLER':
        isCpfValid = cpf.isValid(user.CPF)
        isCnpjValid = cnpj.isValid(user.CPF)

        if (isCpfValid) {
          eventName = 'Cadastro vendedor (CPF)'
        }

        if (isCnpjValid) {
          eventName = 'Cadastro de vendedor (CNPJ)'
        }

        break
      case 'MANAGER':
        eventName = 'Cadastro gerente'
        break
      case 'AGENT':
        eventName = 'Cadastro corretor'
        break
      default:
        eventName = false
        break
    }
    if (eventName) {
      const userData = {
        name: user.name,
        email: user.email
      }

      const payload = {
        eventName: eventName,
        userData: userData
      }

      await EventBus.publish(
        topic,
        payload
      )
    }
  }
}

module.exports = UserService
