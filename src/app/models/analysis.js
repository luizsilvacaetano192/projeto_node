'use strict'
const mongoosePaginate = require('mongoose-paginate-v2')

const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose')

const AnalysisSchema = new Schema(
  {
    buyer: { type: Object, required: true },
    manager: { type: ObjectId, ref: 'users' },
    agent: { type: ObjectId, ref: 'users' },
    value: { type: Number, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
)
AnalysisSchema.plugin(mongoosePaginate)

AnalysisSchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest
})

module.exports = model('analyzes', AnalysisSchema)
