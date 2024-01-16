const Services = require('./Services')
const userRegisterModel = require('../models/userRegister')
const phaseModel = require('../models/phase')
const historyModel = require('../models/history')

class HistoryService extends Services {
  constructor () {
    super(
      'histories',
      'History'
    )
  }

  async saveUserRegister (phaseId, data) {
    const userRegister = await userRegisterModel.create({ ...data })
    let { history } = await phaseModel.findById(phaseId)

    if (typeof history == 'undefined'){

      const newHistory = await historyModel.create( {
        startDate: new Date(),
        phaseIdentificator : 1
      })
  
  
       await phaseModel.findByIdAndUpdate(phaseId, {
        history : newHistory._id
      })

       history  = await phaseModel.findById(phaseId)
       history = history.history;
       console.log('history',history)

    }

    await historyModel.findByIdAndUpdate(history, {
      $push: { registerHistory: userRegister }
    })

    return userRegister
  }

  async updateUserRegister (registerId, data) {
    const userRegister = await userRegisterModel.findByIdAndUpdate(registerId, { description: data.description })
    return userRegister
  }

  async deleteUserRegister (registerId) {
    const userRegister = await userRegisterModel.findByIdAndUpdate(registerId, {
      active: false
    })
    return userRegister
  }
}

module.exports = HistoryService
