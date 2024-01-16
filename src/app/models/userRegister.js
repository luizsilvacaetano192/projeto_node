const Register = require('./register')

const { Schema } = require('mongoose')

const UserRegister = Register.discriminator(
  'UserRegister',
  new Schema({
    description: { type: String }
  })
)

module.exports = UserRegister
