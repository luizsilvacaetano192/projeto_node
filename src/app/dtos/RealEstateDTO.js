const normalizationHelper = require('../helpers/normalizationHelper')

class RealEstateDTO {
  constructor (params) {
    this.properties = [
      'id',
      'name',
      'CNPJ',
      'email',
      'password',
      'resetPassword',
      'phone',
      'active',
      'partner'
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

  setCnpj (CNPJ) {
    this.CNPJ = CNPJ
  }

  setEmail (email) {
    this.email = email
  }

  setPassword (password) {
    this.password = password
  }

  setResetPassword (resetPassword) {
    this.resetPassword = resetPassword
  }

  setPhone (phone) {
    this.phone = phone
  }

  setActive (active) {
    this.active = active
  }
  setPartner (partner) {
    this.partner = partner
  }
  
}

module.exports = RealEstateDTO
