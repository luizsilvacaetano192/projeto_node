const { Router } = require('express')
const ExternalTokensController = require('../controllers/ExternalTokensController')

const router = Router()

router.route('/rdAuth/callback')
  .get([
    (req, res, next) => {
      return ExternalTokensController.rdCallback(req, res, next)
    }
  ])

module.exports = router
