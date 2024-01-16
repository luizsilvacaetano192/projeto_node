const {
  model,
  Schema
} = require('mongoose')

const ExternalTokensSchema = new Schema(
  {
    service: { type: String, require: true },
    tokens: { type: Object, default: {} }
  },
  { timestamps: true }
)

ExternalTokensSchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest
})

module.exports = model('externaltokens', ExternalTokensSchema)
