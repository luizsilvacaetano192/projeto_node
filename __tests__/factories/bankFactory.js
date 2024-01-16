const faker = require('faker')
const { factory } = require('factory-girl')
const { banks } = require('../../src/app/models')

factory.define('Bank', banks, {
  name: faker.company.companyName,
  commission: 0.05,
  active: true
})

module.exports = factory
