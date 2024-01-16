const normalizationHelper = require('../helpers/normalizationHelper')

class AnalysisDTO {
  constructor (params) {
    this.properties = [
      'id',
      'buyer',
      'value',
      'manager',
      'agent',
      'active'
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

  setBuyer (buyer) {
    this.buyer = buyer
  }

  setManager (manager) {
    this.manager = manager
  }

  setAgent (agent) {
    this.agent = agent
  }

  setValue (value) {
    this.value = value
  }

  setActive (active) {
    this.active = active
  }
}

module.exports = AnalysisDTO
