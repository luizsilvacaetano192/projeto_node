const mongoose = require('mongoose')

const ObservationSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    date: { type: Date, required: true },
    active: { type: Boolean, default: true },
    opened: { type: Boolean, default: false }
  },
  { timestamps: true }
)

ObservationSchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest
})

module.exports = mongoose.model('observations', ObservationSchema)
