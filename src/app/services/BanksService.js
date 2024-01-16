const Services = require('./Services')
const { NotAuthorizedError } = require('../middlewares/errors')

class BankService extends Services {
  constructor () {
    super(
      'banks',
      'Bank'
    )
  }

  async create (data) {
    if (!this.scope.hasFullPermission) {
      throw new NotAuthorizedError()
    }

    return await super.create(data)
  }

  async update (id, data) {
   // if (!this.scope.hasFullPermission) {
      //throw new NotAuthorizedError()
   // }

    await super.delete(id)
    delete data.id
    return await super.create(data)
  }

  async delete (id) {
    if (!this.scope.hasFullPermission) {
      throw new NotAuthorizedError()
    }

    return await super.delete(id)
  }
}

module.exports = BankService
