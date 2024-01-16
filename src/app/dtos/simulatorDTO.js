const normalizationHelper = require('../helpers/normalizationHelper')

class NotificationDTO {
  constructor (params) {
    this.properties = [
      
     
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

  
}

module.exports = simulatorDTO
