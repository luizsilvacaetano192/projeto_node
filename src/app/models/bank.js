'use strict'
const mongoosePaginate = require('mongoose-paginate-v2')

const {
  model,
  Schema
} = require('mongoose')

const BankSchema = new Schema(
  {
    name: { type: String, required: true },
    commission: { type: Number, required: true, min: 0, max: 1 },
    tr: { type: Number },
    poupanca: { type: Number },
    selic: { type: Number },
    commission: { type: Number },
    simulator : { type: Boolean, default: false },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
)
BankSchema.plugin(mongoosePaginate)

BankSchema.virtual('commissionPercentage').get(function () {
  return this.commission * 100
})

BankSchema.set('toJSON', {
  transform: (doc, { __v, commissionPercentage, ...rest }, options) => {
    return {
      ...rest,
      commissionPercentage: doc.commissionPercentage
    }
  }
})

module.exports = model('banks', BankSchema)
