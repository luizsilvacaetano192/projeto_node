const faker = require('faker-br')
const { factory } = require('factory-girl')
const { realestateapplications } = require('../../src/app/models')

factory.define('RealEstateApplication', realestateapplications, {
  real_estate_name: faker.company.companyName,
  real_estate_liaison: faker.name.findName,
  real_estate_phone: '6328242962',
  real_estate_email: faker.internet.email,
  applicant_email: faker.internet.email,
  applicant_name: faker.name.findName
})

module.exports = factory
