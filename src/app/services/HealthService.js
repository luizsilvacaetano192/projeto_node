const Services = require('./Services')

class HealthService extends Services {
  constructor () {
    super(
      'Health',
      'Health'
    )
  }

  async testHealth () {
    return {
      status: 200,
      message: 'OK'
    }
  }
}

module.exports = HealthService
