const { factory } = require('factory-girl')
const { phases } = require('../../src/app/models')

factory.define('Phase', phases, {
  observation: [],
  docs: [],
  done: true,
  status: {
    creditAnalysis: true
  },
  detail: {
    bank: 'ITAÚ',
    bankAgency: '',
    CCA: '',
    immobileValue: 190000,
    buyAndSell: 16.97,
    dispatchValue: 1200,
    financedValue: 152000,
    status: 'approved',
    valueAproved: '',
    financedPercentage: ''
  },
  identificator: 1,
  history: '5f32d585f6132c001705942a'
})

module.exports = factory
