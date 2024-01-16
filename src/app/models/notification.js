const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose')

const NotificationSchema = new Schema(
  {
    process: { type: ObjectId, ref: 'processes', required: true },
    phase: { type: ObjectId, ref: 'phases', required: true },
    buyer: { type: ObjectId, ref: 'users', required: true },
    administrator: { type: ObjectId, ref: 'users', required: true },
    operationalAnalyst : { type: ObjectId, ref: 'users', required: false },
    document: { type: String, required: true },
    opened: { type: Boolean, default: false },
    webnotification : { type: Boolean, default: false },
    type : { type: String, required: true , default: 'attachment'  },
  },
  { timestamps: true }
)

NotificationSchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest
})

module.exports = model('notifications', NotificationSchema)
