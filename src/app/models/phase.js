const mongoosePaginate = require('mongoose-paginate-v2')
const PHASES = require('../helpers/enum/phases.enum')

const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose')

const PhaseSchema = new Schema(
  {
    observation: [{ type: ObjectId, ref: 'observations' }],
    history: { type: ObjectId, ref: 'histories' },
    docs: { type: Array, default: [] },
    status: { type: Object, default: {} },
    detail: { type: Object, default: {} },
    done: { type: Boolean, default: false },
    identificator: { type: Number, enum: Object.values(PHASES) },
    dispatchConfirmation  : { type: Boolean, default: false },
    realEstateState : { type: Number, required: false },
    realEstateCity: { type: Number, required: false }
  },
  { timestamps: true }
)

PhaseSchema.plugin(mongoosePaginate)

PhaseSchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest
})

module.exports = model('phases', PhaseSchema)
