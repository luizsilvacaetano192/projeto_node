const { factory } = require('factory-girl')
const { analyzes } = require('../../src/app/models')

factory.define('Analysis', analyzes, {
  buyer: { CPF: '94319884027' },
  value: 250000,
  manager: '5f3197f3f6132c001705941e'
})

module.exports = factory
