const faker = require('faker-br')
const { factory } = require('factory-girl')
const { realestates } = require('../../src/app/models')

factory.define('RealEstate', realestates, {
  name: faker.company.companyName,
  CNPJ: faker.br.cnpj,
  email: faker.internet.email,
  phone: '55555555555',
  password: 'Password@123'
})

module.exports = factory
