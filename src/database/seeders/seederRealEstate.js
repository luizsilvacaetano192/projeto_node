const Dto = require('../../app/dtos/RealEstateDTO')
const model = require('../../app/models/real-estate')

const seeds = [
  {
    name: 'Autônomo',
    CNPJ: '000000000000',
    email: 'autonomo@autonomo.com',
    password: 'd6CskQ{j5@asRKqJ'
  }
]

const seeder = {
  up: async () => {
    try {
      seeds.forEach(async (seed) => {
        const newSeed = new Dto(seed).dump()
        const { password, ...rest } = newSeed
        const isAlreadyRegistered = await model.findOne({
          ...rest
        })
        if (!isAlreadyRegistered) {
          await model.create({ ...newSeed })
        }
      })
    } catch (error) {
      console.error('Não foi possível rodar o Seeder "RealEstate"')
    }
  }
}

module.exports = seeder
