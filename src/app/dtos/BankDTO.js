const normalizationHelper = require('../helpers/normalizationHelper')

class BankDTO {
  constructor (params) {
    this.properties = [
      'id',
      'name',
      'commission',
      'active',
      'tr',
      'poupanca',
      'selic',
      'simulator'
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

  setName (name) {
    this.name = name
  }

  setCommission (commission) {
    this.commission = commission
  }


  setTr (tr) {
    this.tr = tr
  }

  setPoupanca (poupanca) {
    this.poupanca = poupanca
  }

  setSelic (selic) {
    this.selic = selic
  }

  setActive (active) {
    this.active = active
  }

  setSimulator (simulator) {
    this.simulator = simulator
  }

}

module.exports = BankDTO
