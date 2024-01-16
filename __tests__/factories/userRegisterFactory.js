const { factory } = require('factory-girl')
const userRegister = require('../../src/app/models/userRegister')
const { DateTime } = require('luxon')

factory.define('UserRegister', userRegister, {
  description: 'Test description',
  date: DateTime.now()
})

module.exports = factory
