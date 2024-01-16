const mongoosePaginate = require('mongoose-paginate-v2')

const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose')

const ProcessSchema = new Schema(
  {
    phases: [{ type: ObjectId, ref: 'phases', required: true }],
    bank: { type: ObjectId, ref: 'banks', required: true },
    responsible: { type: ObjectId, ref: 'users', required: true },
    buyer: { type: ObjectId, ref: 'users', required: true },
    manager: {
      type: ObjectId,
      ref: 'users',
      required () {
        return !this.agent
      }
    },
    agent: {
      type: ObjectId,
      ref: 'users',
      required () {
        return !this.manager
      }
    },
    seller: { type: ObjectId, ref: 'users' , required: false},
    currentPhase: { type: ObjectId, ref: 'phases' },
    secondBuyer: { type: Object },
    value: { type: Number, required: false },
    archived: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    fromAnalysis: { type: ObjectId, ref: 'analyzes' },
    agentCommission: { type: Number },
    operationalAnalyst : { type: Number , default: 0},
  
  },
  { timestamps: true }
)
ProcessSchema.plugin(mongoosePaginate)

ProcessSchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest
})

module.exports = model('processes', ProcessSchema)
