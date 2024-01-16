const normalizationHelper = require('../helpers/normalizationHelper')

class RealEstateApplicationDTO {
  constructor (params) {
    this.properties = [
      'id',
      'real_estate_name',
      'real_estate_liaison',
      'real_estate_phone',
      'real_estate_email',
      'applicant_email',
      'applicant_name'
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

  setRealEstateName (realEstateName) {
    this.real_estate_name = realEstateName
  }

  setRealEstateLiaison (realEstateLiaison) {
    this.real_estate_liaison = realEstateLiaison
  }

  setRealEstatePhone (realEstatePhone) {
    this.real_estate_phone = realEstatePhone
  }

  setRealEstateEmail (realEstateEmail) {
    this.real_estate_email = realEstateEmail
  }

  setApplicantEmail (applicantEmail) {
    this.applicant_email = applicantEmail
  }

  setApplicantName (applicantName) {
    this.applicant_name = applicantName
  }
}

module.exports = RealEstateApplicationDTO
