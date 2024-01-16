const normalizationHelper = require('../helpers/normalizationHelper')

class NotificationDTO {
  constructor (params) {
    this.properties = [
      'id',
      'process',
      'phase',
      'buyer',
      'administrator',
      'document',
      'opened',
      'webnotification',
      'type'
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

  setProcess (process) {
    this.process = process
  }

  setPhase (phase) {
    this.phase = phase
  }

  setBuyer (buyer) {
    this.buyer = buyer
  }

  setAdministrator (administrator) {
    this.administrator = administrator
  }

  setDocument (document) {
    this.document = document
  }

  setOpened (opened) {
    this.opened = opened
  }

  setWebnotification (webnotification) {
    this.webnotification = webnotification
  }

  setType (type) {
    this.type = type
  }
}

module.exports = NotificationDTO
