const { factory } = require('factory-girl')
const { observations } = require('../../src/app/models')

factory.define('Observation', observations, {
  description: 'Observation Test',
  date: '05/09/2021'
})

module.exports = factory
