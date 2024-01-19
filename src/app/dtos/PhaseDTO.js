const normalizationHelper = require('../helpers/normalizationHelper')

class PhaseDTO {
  constructor (params) {
    this.properties = [
      'id',
      'observation',
      'history',
      'docs',
      'status',
      'detail',
      'done',
      'identificator',
      'dispatchConfirmation'
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

  setObservation (observation) {
    this.observation = observation
  }

  setHistory (history) {
    this.history = history
  }

  setDocs (docs) {
    this.docs = docs
  }

  setStatus (status) {
    this.status = status
  }

  setDetail (detail) {
    this.detail = detail
  }

  setDone (done) {
    this.done = done
  }

  setIdentificator (identificator) {
    this.identificator = identificator
  }

  setDispatchConfirmation (dispatchConfirmation) {
    this.dispatchConfirmation = dispatchConfirmation
  }
}

module.exports = PhaseDTO
