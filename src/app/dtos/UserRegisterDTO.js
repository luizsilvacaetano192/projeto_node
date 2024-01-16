const normalizationHelper = require('../helpers/normalizationHelper')
const { DateTime } = require('luxon')

class UserRegisterDTO {
  constructor (params) {
    this.properties = [
      'description',
      'date'
    ]

    let method = ''

    if (typeof params.date === 'undefined') {
      params.date = DateTime.now().toFormat('dd/MM/yyyy')
    }

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

  setDescription (description) {
    this.description = description
  }

  setDate (date) {
    date = DateTime.fromFormat(date, 'dd/MM/yyyy')
    this.date = date
  }
}

module.exports = UserRegisterDTO
