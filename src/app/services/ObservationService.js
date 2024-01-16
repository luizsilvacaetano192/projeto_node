const Services = require('./Services')
const processModel = require('../models/process')
const phaseModel = require('../models/phase')
const PhaseService = require('./PhaseService')

class ObservationService extends Services {
  constructor () {
    super(
      'observations',
      'Observation'
    )
  }

  async getByProcessId (processId) {
    const observation = await processModel.findById(processId).populate({
      path: 'phases',
      select: ['observation', 'identificator'],
      populate: 'observation history'
    })
    return observation
  }

  async create (data) {
    const phaseId = data.id
    delete data.id
    const observation = await super.create(data)
    await phaseModel.findByIdAndUpdate(phaseId, {
      $push: { observation: observation._id }
    })

    const [currentProcess] = await processModel.find({
      phases: { $in: [phaseId] }
    })
    const retorno = new PhaseService()
    await retorno.PushNotification(
      'Observação adicionada : ' + observation.description,
      currentProcess.responsible
    )
    await retorno.PushNotification(
      'Observação adicionada : ' + observation.description,
      currentProcess.manager
    )
    await retorno.PushNotification(
      'Observação adicionada : ' + observation.description,
      currentProcess.agent
    )
    await retorno.PushNotification(
      'Observação adicionada : ' + observation.description,
      currentProcess.seller
    )
    await retorno.PushNotification(
      'Observação adicionada : ' + observation.description,
      currentProcess.buyer
    )
    return observation
  }
}

module.exports = ObservationService
