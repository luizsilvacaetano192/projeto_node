const faker = require('faker')
const { factory } = require('factory-girl')
const { users } = require('../../src/app/models')
const commonMethods = require('../utils/commonMethods')

factory.define('User', users, {
  name: faker.name.findName,
  CPF: commonMethods.generateCpf(),
  email: faker.internet.email,
  phone: faker.phone.phoneNumber,
  password: 'Password@123',
  birthDate: '1979-06-09T03:00:00.000Z',
  creci : '1111111111',
  role: 'ADMINISTRATOR',
  isMaster: false,
  notificationToken: 'fd4fd54fd5f4d5f45f45d4f5df45d4f5d4fd4f54d5f4d5f4d5f4fd5'
})

module.exports = factory
