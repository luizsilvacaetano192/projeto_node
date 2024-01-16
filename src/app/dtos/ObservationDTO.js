const normalizationHelper = require('../helpers/normalizationHelper')
const { DateTime } = require('luxon')

class ObservationDTO {
  constructor (params) {
    this.properties = [
      'id',
      'description',
      'date',
      'active',
      'opened'
    ]

    if (typeof params.date === 'undefined') {
      params.date = DateTime.now().toFormat('dd/MM/yyyy')
    }

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

  setDescription (description) {
    this.description = description
  }

  setDate (date) {
    date = DateTime.fromFormat(date, 'dd/MM/yyyy')
    date = date.toISO()
    this.date = date
  }

  setActive (active) {
    this.active = active
  }

  setOpened (opened) {
    this.opened = opened
  }
}

module.exports = ObservationDTO
