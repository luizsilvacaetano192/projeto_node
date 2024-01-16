const userModel = require('../models/user')
const USER_ROLES = require('../helpers/enum/roles.enum')

const parseAnalysisInput = async (req, res, next) => {
  try {
    if (typeof req.body.immobileValue !== 'undefined') {
      req.body.value = req.body.immobileValue
    }
    if (typeof req.body.requestUserId !== 'undefined') {
      const requestUser = await userModel.findById(req.body.requestUserId)
      switch (requestUser.role) {
        case USER_ROLES.AGENT:
          req.body.agent = req.body.requestUserId
          break
        case USER_ROLES.MANAGER:
          req.body.manager = req.body.requestUserId
          break
      }
    }
    return next()
  } catch (error) {
    next(error)
  }
}

const parseProcessInput = async (req, res, next) => {
  try {
    if (typeof req.body.administratorId !== 'undefined') {
      req.body.responsible = req.body.administratorId
      delete req.body.administratorId
    }

    if (typeof req.body.idAnalysis !== 'undefined') {
      req.body.fromAnalysis = req.body.idAnalysis
      delete req.body.idAnalysis
    }
    return next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  parseAnalysisInput,
  parseProcessInput
}
