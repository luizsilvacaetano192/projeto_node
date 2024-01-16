const mongoose = require('mongoose')

const { model, Schema } = mongoose

const RegisterSchema = new Schema(
  {
    date: { type: Date, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true, discriminatorKey: 'type' }
)

const Register = model('Register', RegisterSchema)

RegisterSchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest
})

module.exports = Register
