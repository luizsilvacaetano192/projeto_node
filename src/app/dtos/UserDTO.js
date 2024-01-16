const normalizationHelper = require('../helpers/normalizationHelper')

class UserDTO {
  constructor (params) {
    this.properties = [
      'id',
      'name',
      'CPF',
      'email',
      'password',
      'phone',
      'birthDate',
      'role',
      'creci',
      'active',
      'isMaster',
      'realEstate',
      'resetPassword',
      'notificationToken'
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

  setCpf (CPF) {
    this.CPF = CPF
  }

  setEmail (email) {
    this.email = email
  }

  setPassword (password) {
    this.password = password
  }

  setPhone (phone) {
    this.phone = phone
  }

  setBirthdate (birthDate) {
    this.birthDate = birthDate
  }

  setRole (role) {
    this.role = role.toUpperCase()
  }

  setCreci (creci) {
    this.creci = creci
  }

  setActive (active) {
    this.active = active
  }

  setIsMaster (isMaster) {
    this.isMaster = isMaster
  }

  setRealestate (realEstate) {
    this.realEstate = realEstate
  }

  setResetPassword (resetPassword) {
    this.resetPassword = resetPassword
  }

  setNotificationToken (notificationToken) {
    this.notificationToken = notificationToken
  }
}

module.exports = UserDTO
