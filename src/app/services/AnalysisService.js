const Services = require('./Services')
const analysisModel = require('../models/analysis')

class AnalysisService extends Services {
  constructor () {
    super(
      'analyzes',
      'Analysis'
    )
  }

  async paginate (options, where = {}) {
    options.populate = [{ path: 'manager' }, { path: 'agent' }]
    return analysisModel.paginate({ active: true, ...where }, options)
  }

  async getById (id) {
    return analysisModel.findById(id).populate('manager').populate('agent')
  }
}

module.exports = AnalysisService
