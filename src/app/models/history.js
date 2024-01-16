const PHASES = require('../helpers/enum/phases.enum')

const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose')

const HistorySchema = new Schema(
  {
    phaseIdentificator: {
      type: Number,
      enum: Object.values(PHASES),
      required: true
    },
    startDate: { type: Date, required: true },
    finalDate: { type: Date },
    registerHistory: [{ type: ObjectId, ref: 'Register' }]
  },
  { timestamps: true }
)

HistorySchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest
})

module.exports = model('histories', HistorySchema)
