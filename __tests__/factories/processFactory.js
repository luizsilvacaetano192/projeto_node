const { factory } = require('factory-girl')
const { processes } = require('../../src/app/models')

factory.define('Process', processes, {
  phases: [
    '5f32d4e7f6132c0017059420',
    '5f32d4e7f6132c0017059421',
    '5f32d4e7f6132c0017059422',
    '5f32d4e7f6132c0017059423',
    '5f32d4e7f6132c0017059424',
    '5f32d4e7f6132c0017059425'
  ],
  archived: false,
  active: true,
  bank: '5f32cfeaf6132c001705941f',
  buyer: '5f32d4e7f6132c0017059428',
  currentPhase: '5f32d4e7f6132c0017059420',
  value: 152000,
  manager: '5f3197f3f6132c001705941e',
  agent: '5f32cfb438fea50010e3c33b',
  seller: '5f32d4e7f6132c0017059427',
  responsible: '5f2ac5c190bac50c158ebf0c',
  fromAnalysis: '613168d28967c90501844530',
  agentCommission: 0.06
})

module.exports = factory
