const normalizationHelper = require('../helpers/normalizationHelper')

class ProcessDTO {
  constructor (params) {
    this.properties = [
      'id',
      'phases',
      'bank',
      'responsible',
      'buyer',
      'manager',
      'agent',
      'seller',
      'currentPhase',
      'secondBuyer',
      'value',
      'archived',
      'active',
      'fromAnalysis',
      'agentCommission',
      'realEstateCity',
      'realEstateState ',
      'operationalAnalyst'
    ]

    let method = ''
    this.properties.forEach(async property => {
      if (typeof (params[property]) !== 'undefined') {
        method = `set_${property}`
        method = normalizationHelper.camelize(method)
        this[method](params[property])
      }
    })
  }

  dump () {
    const params = {}
    this.properties.forEach(property => {
      if (typeof (this[property]) !== 'undefined') {
        params[property] = this[property]
      }
    })
    return params
  }

  setId (id) {
    this.id = id
  }

  setPhases (phases) {
    this.phases = phases
  }

  setBank (bank) {
    this.bank = bank
  }

  setResponsible (responsible) {
    this.responsible = responsible
  }

  setBuyer (buyer) {
    this.buyer = buyer
  }

  setManager (manager) {
    this.manager = manager
  }

  setAgent (agent) {
    this.agent = agent
  }

  setSeller (seller) {
    this.seller = seller
  }

  setCurrentPhase (currentPhase) {
    this.currentPhase = currentPhase
  }

  setSecondBuyer (secondBuyer) {
    this.secondBuyer = secondBuyer
  }

  setValue (value) {
    this.value = value
  }

  setArchived (archived) {
    this.archived = archived
  }

  setActive (active) {
    this.active = active
  }

  setFromanalysis (fromAnalysis) {
    this.fromAnalysis = fromAnalysis
  }

  setAgentcommission (agentCommission) {
    this.agentCommission = agentCommission
  }

  setrealEstateState  (realEstateState ) {
    this.realEstateState  = realEstateState 
  }

  setRealEstateCity (realEstateCity) {
    this.realEstateCity = realEstateCity
  }

  setOperationalAnalyst (operationalAnalyst) {
    this.operationalAnalyst = operationalAnalyst
  }


  
}

module.exports = ProcessDTO
