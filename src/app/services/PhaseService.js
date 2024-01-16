const Services = require('./Services')
const phaseModel = require('../models/phase')
const processModel = require('../models/process')
const notificationModel = require('../models/notification')
const statusRegisterModel = require('../models/statusRegister')
const historyModel = require('../models/history')
const userModel = require('../models/user')
const userService = require('./UserService')
const PHASE_ENUM = require('../helpers/enum/phases.enum')
const ROLES = require('../helpers/enum/roles.enum')
const { DateTime } = require('luxon')
const { BadRequestException } = require('../middlewares/errors')
const uploadHelper = require('../helpers/uploadHelper')
const { cpf, cnpj } = require('cpf-cnpj-validator')

const EventBus = require('../helpers/eventBus')
const admin = require('firebase-admin')
const serviceAccount = require('../../../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

class PhaseService extends Services {
  constructor () {
    super(
      'phases',
      'Phase'
    )
  }

  async getByPhaseId (id) {
    return phaseModel.findById(id)
      .populate({ path: 'observation', match: { active: true } })
      .populate({
        path: 'history',
        populate: { path: 'registerHistory', match: { active: true } }
      })
  }

  async update (id, type, data) {
    if (type === 'save') {
      return this.save(id, data)
    }

    if (type === 'finish') {
      return this.finish(id, data)
    }
  }

  async save (id, data) {
    console.log('data',data)
    const phase = await super.getById(id)
    const { identificator, history, status } = phase
    const {
      detail: { buyer, seller, agent, manager ,operationalAnalyst, responsible}
    } = data

    const [currentProcess] = await processModel.find({
      phases: { $in: [id] }
    })

    if (identificator === PHASE_ENUM.ONE) {
      if (buyer) {
        await this.findAndUpdateBuyer(buyer)
      }


      let value = data.detail.financedValue

      if (data.detail.status === 'conditioned') {
        value = data.detail.valueAproved
      }

      if (seller) {
        const sellerId = await this.createOrUpdateSeller(seller)
        await processModel.findByIdAndUpdate(currentProcess._id, {
          value,
          secondBuyer: data.detail.secondBuyer,
          seller: sellerId,
         
        })
      }

   
     /* const  notificacao = await notificationModel.create({
        process: id,
        buyer: buyer,
        operationalAnalyst : operationalAnalyst,
        phase: currentProcess,
        administrator: responsible,
        document : 'O processo foi transferido para Teste' ,
        type:'transfer'
      })
      console.log('notificacao',notificacao);*/
    }



    if (agent) {
      await processModel.findByIdAndUpdate(currentProcess._id, {
       
        agent : agent._id,
      })
    }

    if (manager) {
      await processModel.findByIdAndUpdate(currentProcess._id, {
     
        manager : manager._id
      })
    }
  
  
  

    const statusChange = this.generateStatusHistory(status, data.status)

    if (Object.keys(statusChange).length > 0) {
      const statusRegister = await statusRegisterModel.create({
        newStatus: statusChange,
        date: DateTime.now()
      })
      await historyModel.findByIdAndUpdate(history, {
        $push: { registerHistory: statusRegister }
      })
    }
    if (identificator === PHASE_ENUM.TWO) {
      if (data.detail.survey.date) {
        await this.PushNotification(
          'A vistoria foi agendada para : ' + data.detail.survey.date + ' as ' + data.detail.survey.hour,
          currentProcess.responsible
        )
        await this.PushNotification(
          'A vistoria foi agendada para : ' + data.detail.survey.date + ' as ' + data.detail.survey.hour,
          currentProcess.manager
        )
        await this.PushNotification(
          'A vistoria foi agendada para : ' + data.detail.survey.date + ' as ' + data.detail.survey.hour,
          currentProcess.agent
        )
        await this.PushNotification(
          'A vistoria foi agendada para : ' + data.detail.survey.date + ' as ' + data.detail.survey.hour,
          currentProcess.seller
        )
        await this.PushNotification(
          'A vistoria foi agendada para : ' + data.detail.survey.date + ' as ' + data.detail.survey.hour,
          currentProcess.buyer
        )
      }

      if (data.detail.reportValue) {
        await this.PushNotification(
          'O valor do laudo é : ' + data.detail.reportValue,
          currentProcess.responsible
        )
        await this.PushNotification(
          'O valor do laudo é : ' + data.detail.reportValue,
          currentProcess.manager
        )
        await this.PushNotification(
          'O valor do laudo é : ' + data.detail.reportValue,
          currentProcess.agent
        )
        await this.PushNotification(
          'O valor do laudo é : ' + data.detail.reportValue,
          currentProcess.seller
        )
        await this.PushNotification(
          'O valor do laudo é : ' + data.detail.reportValue,
          currentProcess.buyer
        )
      }

      if (data.status.immobileAcept) {
        await this.PushNotification(
          'Imovel aceito como garantia',
          currentProcess.responsible
        )
        await this.PushNotification(
          'Imovel aceito como garantia',
          currentProcess.manager
        )
        await this.PushNotification(
          'Imovel aceito como garantia',
          currentProcess.agent
        )
        await this.PushNotification(
          'Imovel aceito como garantia',
          currentProcess.seller
        )
        await this.PushNotification(
          'Imovel aceito como garantia',
          currentProcess.buyer
        )
      }
    }

    if (identificator === PHASE_ENUM.FOUR) {
      if (data.status.interviewConducted) {
        await this.PushNotification(
          'A intrevista foi agendada',
          currentProcess.responsible
        )
        await this.PushNotification(
          'A intrevista foi agendada',
          currentProcess.manager
        )
        await this.PushNotification(
          'A intrevista foi agendada',
          currentProcess.agent
        )
        await this.PushNotification(
          'A intrevista foi agendada',
          currentProcess.seller
        )
        await this.PushNotification(
          'A intrevista foi agendada',
          currentProcess.buyer
        )
      }

      if (data.status.subscriptionScheduled) {
        await this.PushNotification(
          'A assintura foi agendada',
          currentProcess.responsible
        )
        await this.PushNotification(
          'A assintura foi agendada',
          currentProcess.manager
        )
        await this.PushNotification(
          'A assintura foi agendada',
          currentProcess.agent
        )
        await this.PushNotification(
          'A assintura foi agendada',
          currentProcess.seller
        )
        await this.PushNotification(
          'A assintura foi agendada',
          currentProcess.buyer
        )
      }

      if (data.status.signedContract) {
        await this.PushNotification(
          'O contrato foi assinado',
          currentProcess.responsible
        )
        await this.PushNotification(
          'O contrato foi assinado',
          currentProcess.manager
        )
        await this.PushNotification(
          'O contrato foi assinado',
          currentProcess.agent
        )
        await this.PushNotification(
          'O contrato foi assinado',
          currentProcess.seller
        )
        await this.PushNotification(
          'O contrato foi assinado',
          currentProcess.buyer
        )
      }
    }
    if (identificator === PHASE_ENUM.FIVE) {
      if (data.status.filedProcess) {
        await this.PushNotification(
          'A processo foi protocolado',
          currentProcess.responsible
        )
        await this.PushNotification(
          'A processo foi protocolado',
          currentProcess.manager
        )
        await this.PushNotification(
          'A processo foi protocolado',
          currentProcess.agent
        )
        await this.PushNotification(
          'A processo foi protocolado',
          currentProcess.seller
        )
        await this.PushNotification(
          'A processo foi protocolado',
          currentProcess.buyer
        )
      }
    }
    if (identificator === PHASE_ENUM.SIX) {
      if (data.status.contractSended) {
        await this.PushNotification(
          'Contrato enviado',
          currentProcess.responsible
        )
        await this.PushNotification(
          'Contrato enviado',
          currentProcess.manager
        )
        await this.PushNotification(
          'Contrato enviado',
          currentProcess.agent
        )
        await this.PushNotification(
          'Contrato enviado',
          currentProcess.seller
        )
        await this.PushNotification(
          'Contrato enviado',
          currentProcess.buyer
        )
      }

      if (data.status.fundReleased) {
        await this.PushNotification(
          'Contrato enviado',
          currentProcess.responsible
        )
        await this.PushNotification(
          'Contrato enviado',
          currentProcess.manager
        )
        await this.PushNotification(
          'Contrato enviado',
          currentProcess.agent
        )
        await this.PushNotification(
          'Contrato enviado',
          currentProcess.seller
        )
        await this.PushNotification(
          'Contrato enviado',
          currentProcess.buyer
        )
      }
    }

    console.log('dataaaaaaaaa',data)

    return phaseModel.findByIdAndUpdate(id, data)
  }

  async PushNotification (bodyMessage, to) {
    if(to != null){
      const retorno = new userService()
      console.log('to', to)
      const { notificationToken } = await retorno.getById(to)
      console.log('token enviado ',notificationToken)
      if (notificationToken) {
        const message = {
          notification: {
            title: 'Concede Crédito',
            body: bodyMessage
          },
          token: notificationToken
        }
        admin
          .messaging()
          .send(message)
          .then((response) => {
            console.log('Push notification enviado com sucesso:', response)
          })
          .catch((error) => {
            console.log('Erro ao enviar push notification:', error)
          })
      }
    }
    
  }

  async finish (id, data) {

    const phase = await phaseModel.findById(id)

    const { identificator, history } = phase

    const countIdentifier = { count: identificator }
    const isLastPhase = { status: false }

    const {
      status,
      detail: { buyer, seller }
    } = data

    const [currentProcess] = await processModel.find({
      phases: { $in: [id] }
    })

    const process = await processModel.find({
      phases: { $in: [id] }
    })

    if (currentProcess.archived) { throw new BadRequestException('O processo esta arquivado.') }

    if (!this.validStatuses(status)) { throw new BadRequestException('Status não valido para finalização') }


    const statusChange = this.generateStatusHistory(phase.status, status)
    if (Object.keys(statusChange).length > 0) {
      const statusRegister = await statusRegisterModel.create({
        newStatus: statusChange,
        date: new Date()
      })
      await historyModel.findByIdAndUpdate(history, {
        $push: { registerHistory: statusRegister }
      })
    }

    await historyModel.findByIdAndUpdate(history, {
      finalDate: new Date()
    })

    if (identificator === PHASE_ENUM.SIX) {
      isLastPhase.status = true

      if (status.finished) {
        const processSeller = await userModel.findById(currentProcess.seller)
        if (processSeller) {
          const isCpfValid = cpf.isValid(processSeller.CPF)
          const isCnpjValid = cnpj.isValid(processSeller.CPF)

          let eventName = false
          if (isCpfValid) {
            eventName = 'Venda Concluída - fase 6 (CPF)'
          }

          if (isCnpjValid) {
            eventName = 'Venda Concluída - fase 6'
          }
          if (eventName) {
            await this.convertLeadIntoEvent(eventName, processSeller)
          }
        }
      }
    }

    if (identificator !== PHASE_ENUM.SIX) {
      countIdentifier.count += 1

      const historyPhase = await historyModel.create({
        phaseIdentificator: identificator + 1,
        startDate: new Date()
      })

      await phaseModel.findOneAndUpdate(
        {
          _id: { $in: currentProcess.phases },
          identificator: identificator + 1
        },
        {
          history: historyPhase
        }
      )

      if ((identificator + 1) === PHASE_ENUM.FOUR) {
        const processBuyer = await userModel.findById(currentProcess.buyer)
        if (processBuyer) {
          await this.convertLeadIntoEvent('Assinatura Cliente (fase 4)', processBuyer)
        }
      }
    }



    if (identificator === PHASE_ENUM.ONE) {
      await this.archiveOldOpenedBuyerProcess(currentProcess)

      if (buyer) {
        await this.findAndUpdateBuyer(buyer)
      }

   

      let sellerId
      if (seller) {
        sellerId = await this.createOrUpdateSeller(seller)
      }

      let value = data.detail.financedValue

      if (data.detail.status === 'conditioned') {
        value = data.detail.valueAproved
      }



      if (data.detail.status === 'approved') {
        const processBuyer = await userModel.findById(currentProcess.buyer)
        if (processBuyer) {
          await this.convertLeadIntoEvent('Crédito aprovado (final fase 1)', processBuyer)
        }
      }

      await processModel.findByIdAndUpdate(currentProcess._id, {
        value,
        secondBuyer: data.detail.secondBuyer,
        seller: sellerId
      })

 
     if(typeof data.detail.operationalAnalyst != "undefined"){
      const  notificacao = await notificationModel.create({
        process: process[0]._id,
        buyer: process[0].buyer,
        operationalAnalyst : data.detail.operationalAnalyst,
        phase: process[0].currentPhase,
        administrator: data.detail.operationalAnalyst,
        document : 'O processo foi transferido para você' ,
        webnotification : true,
        type:'transfer'
      })
      

     }
      
      
      
    }

    const updateProcess = this.updateProcessPhase(
      identificator,
      currentProcess._id,
      currentProcess.phases
    )

    await updateProcess()
    /*
      [Refactor] Anotação para desenvolvimento futuro:

      O codigo abaixo é uma cópia do codigo legado que
      realizava o envio de push notification para o comprador.

      Quando tivermos a implementação de push notification
      Adicionar aqui a chamada ao EventBus

    */

    const phasesTitles = {
      1: 'Fase 1 - Análise de crédito',
      2: 'Fase 2 - Avaliação do imóvel / Análise documental',
      3: 'Fase 3 - Análise Jurídica',
      4: 'Fase 4 - Assinatura do contrato',
      5: 'Fase 5 - Impostos / Registro',
      6: 'Fase 6 - Liberação do recurso'
    }

    const endLastPhaseMessage = 'Última fase do processo foi concluída com sucesso!'

    const sendNotificationTo = async (to, phaseIdentifier, isLastPhase) => {
      if(to != null){



        const retorno = new userService()
        const { notificationToken } = await retorno.getById(to)
        if (!notificationToken) {
          console.log('Notification token not found')
          return
        }
        const bodyPhasesMessage = `Seu processo passou para: ${phasesTitles[phaseIdentifier]}`
        const bodyMessage = isLastPhase ? endLastPhaseMessage : bodyPhasesMessage
        const message = {
          notification: {
            title: 'Concede Crédito',
            body: bodyMessage
          },
          token: notificationToken
        }
        admin
          .messaging()
          .send(message)
          .then((response) => {
            console.log('Push notification enviado com sucesso:', response)
          })
          .catch((error) => {
            console.log('Erro ao enviar push notification:', error)
          })
      }
     
    }

    const [relations] = process

    await sendNotificationTo(
      relations.responsible,
      countIdentifier.count,
      isLastPhase.status
    )

    await sendNotificationTo(
      relations.buyer,
      countIdentifier.count,
      isLastPhase.status
    )

    await sendNotificationTo(
      relations.seller,
      countIdentifier.count,
      isLastPhase.status
    )

    await sendNotificationTo(
      relations.manager,
      countIdentifier.count,
      isLastPhase.status
    )

    await sendNotificationTo(
      relations.agent,
      countIdentifier.count,
      isLastPhase.status
    )

    return phaseModel.findByIdAndUpdate(id, { ...data, done: true })
  }

  async findAndUpdateBuyer (buyer) {
    const hasBuyer = await userModel.findOne({
      CPF: buyer.CPF,
      active: true,
      role: ROLES.BUYER
    })

    if (hasBuyer) {
      await userModel.updateOne(
        { _id: hasBuyer._id },
        { email: buyer.email, phone: buyer.phone }
      )
    }
  }

  async createOrUpdateSeller (seller) {
    userService.scope = this.scope
    if (seller.CPF) {
      const hasSeller = await userModel.findOne({
        CPF: seller.CPF,
        active: true,
        role: ROLES.SELLER
      })

      if (hasSeller) {
        await userModel.updateOne(
          { _id: hasSeller._id },
          {
            email: seller.email,
            name: seller.name,
            CPF: seller.CPF,
            phone: seller.phone
          }
        )
        return hasSeller._id
      }
      const processSeller = new userService()

      await processSeller.create(
        {
          name: seller.name,
          CPF: seller.CPF,
          email: seller.email,
          phone: seller.phone
        },
        ROLES.SELLER
      )
      return processSeller._id
    }
  }

  generateStatusHistory (oldStatus, newStatus) {
    const statusChanges = {}

    Object.keys(newStatus).map((status) => {
      if (oldStatus[status] !== newStatus[status]) { statusChanges[status] = newStatus[status] }
      return statusChanges
    })

    return statusChanges
  }

  updateProcessPhase (identificator, processId, phasesArray) {
    const phases = {
      1: () =>
        processModel.findByIdAndUpdate(processId, {
          currentPhase: phasesArray[1]
        }),
      2: () =>
        processModel.findByIdAndUpdate(processId, {
          currentPhase: phasesArray[2]
        }),
      3: () =>
        processModel.findByIdAndUpdate(processId, {
          currentPhase: phasesArray[3]
        }),
      4: () =>
        processModel.findByIdAndUpdate(processId, {
          currentPhase: phasesArray[4]
        }),
      5: () =>
        processModel.findByIdAndUpdate(processId, {
          currentPhase: phasesArray[5]
        }),
      6: () => null
    }
    return phases[identificator]
  }

  async archiveOldOpenedBuyerProcess (currentProcess) {
    await processModel.updateMany(
      {
        _id: { $nin: [currentProcess._id] },
        buyer: currentProcess.buyer,
        active: true
      },
      { $set: { archived: true } }
    )
  }

  validStatuses (statuses) {
    if(typeof statuses.documentationDone !== "undefined"){
      statuses.documentationDone = true;
    }
    
    const values = Object.values(statuses)

    return values.every((value) => value)
  }

  async upload (params) {
    console.log('como esta chegando os parametros',params);
    if (params.files.length === 0) {
      throw new Error('Não foi possível localizar o arquivo!')
    }

    const uploads = await Promise.all(params.files.map((file) => {
      return uploadHelper.upload(
        params.phaseId,
        params.processId,
        params.complementar,
        file
      )
    }))

    const response = uploads.map(async (data) => {
      await phaseModel.findByIdAndUpdate(params.phaseId, {
        $push: {
          docs: {
            location: data.Location,
            date: new Date(),
            complementar: params.complementar,
            fieldName: params.fieldName,
            downloaded: false
          }
        }
      })
      const process = await processModel.findById(params.processId)
      if (
        params.complementar === 'true' ||
        params.fieldName === 'Comprovante de Pagamento'
      ) {
        let document = ''
        if (params.complementar === 'true') {
          document = 'documento complementar'
        } else {
          document = params.fieldName
        }
        await notificationModel.create({
          process: process._id,
          buyer: process.buyer,
          phase: params.phaseId,
          administrator: process.responsible,
          document,
          type:'attachment'
        })
      }
      await this.PushNotification(
        'Documento de ' + params.fieldName + ' Anexado',
        process.responsible

      )
      await this.PushNotification(
        'Documento de ' + params.fieldName + ' Anexado',
        process.manager

      )
      await this.PushNotification(
        'Documento de ' + params.fieldName + ' Anexado',
        process.agent

      )
      await this.PushNotification(
        'Documento de ' + params.fieldName + ' Anexado',
        process.seller

      )
      await this.PushNotification(
        'Documento de ' + params.fieldName + ' Anexado',
        process.buyer

      )
    })

    return response
  }

  async setDownloaded (phaseId, fieldName, downloaded) {
    const phase = await super.getById(phaseId)

    let { docs } = phase

    docs = docs.map((doc) => {
      if (doc.fieldName === fieldName) {
        doc.downloaded = downloaded
      }
      return doc
    })

    return super.update(phaseId, {
      docs
    })
  }

  async convertLeadIntoEvent (eventName, user) {
    const topic = 'leadConversion'

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

module.exports = PhaseService
