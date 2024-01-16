const { factory } = require('factory-girl')
const { histories } = require('../../src/app/models')

factory.define('History', histories, {
  phaseIdentificator: 1,
  active: true,
  type: 'StatusRegister',
  newStatus: {
    creditAnalysis: true
  },
  startDate: '2020-08-11T17:27:03.019Z'
})

module.exports = factory
