const {
  model,
  Schema
} = require('mongoose')

const MessagesSchema = new Schema(
  {
    type: { type: String, require: true },
    to: { type: String, require: true },
    from: { type: String },
    subject: { type: String },
    message: { type: String, require: true },
    response_payload: { type: String },
    read: { type: Boolean, require: true }
  },
  { timestamps: true }
)

MessagesSchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest
})

module.exports = model('message', MessagesSchema)
