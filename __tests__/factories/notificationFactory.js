const { factory } = require('factory-girl')
const { notifications } = require('../../src/app/models')

factory.define('Notification', notifications, {
  opened: true,
  process: '5f3fc6cff6132c0017059503',
  buyer: '5f3fc6cff6132c0017059502',
  phase: '5f3fc6cef6132c00170594fb',
  administrator: '5f3a72a538fea50010e3c361',
  document: 'documento complementar'
})

module.exports = factory
