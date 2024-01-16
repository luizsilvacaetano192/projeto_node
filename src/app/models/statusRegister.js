const Register = require('./register')

const { Schema } = require('mongoose')

const StatusRegister = Register.discriminator(
  'StatusRegister',
  new Schema({
    newStatus: { type: Object }
  })
)

module.exports = StatusRegister
