require('dotenv').config({
  path: ['test', 'dev'].indexOf(process.env.NODE_ENV) !== -1 ? `.env.${process.env.NODE_ENV}` : '.env'
})

const cors = require('cors')
const express = require('express')
const mongoConnector = require('./config/db')
const handlers = require('./app/handlers')
const seeders = require('./database/seeders')

class AppController {
  constructor () {
    this.express = express()
    handlers.init()

    this.middlewares()
    this.routes()
    this.errors()

    mongoConnector()
    seeders.run()

    this.express.use(cors())
    this.express.options('*', cors())
  }

  middlewares () {
    this.express.use(express.json())

    require('./app/middlewares/authStrategy')
    require('./app/helpers/redis/accessTokenBlacklist')
    require('./app/helpers/redis/refreshTokenWhitelist')
  }

  routes () {
    this.express.use(require('./app/routes'))
  }

  seeders () {
    this.express.use(require('./database/seeders'))
  }

  errors () {
    this.express.use(require('./app/middlewares/errorResponse'))
  }
}

module.exports = new AppController().express
