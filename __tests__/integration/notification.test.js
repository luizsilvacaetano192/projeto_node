/* eslint-disable no-useless-escape */
const { it, describe, expect, beforeAll, beforeEach } = require('@jest/globals')
const request = require('supertest')
const factory = require('../factories/notificationFactory')
const userFactory = require('../factories/userFactory')
const bankFactory = require('../factories/bankFactory')
const analysisFactory = require('../factories/analysisFactory')
const commonMethods = require('../utils/commonMethods')

const app = require('../../src/app')

let userBuyer
let userSeller
let userManager
let userAgent
let userAdministrator
let bank
let analysis
let process

let notification

const loggedUser = {}

beforeAll(async () => {
  loggedUser.user = await userFactory.create('User', { isMaster: true })
  loggedUser.token = await commonMethods.logUser(loggedUser.user, app, request)
})

beforeEach(async () => {
  userBuyer = await userFactory.create('User', { role: 'BUYER' })
  userSeller = await userFactory.create('User', { role: 'SELLER' })
  userManager = await userFactory.create('User', { role: 'MANAGER' })
  userAgent = await userFactory.create('User', { role: 'AGENT' })
  userAdministrator = await userFactory.create('User', { role: 'ADMINISTRATOR' })

  bank = await bankFactory.create('Bank')

  analysis = await analysisFactory.create('Analysis', { buyer: { CPF: userBuyer.CPF }, manager: userManager._id })

  process = await commonMethods.generateProcess(
    userBuyer,
    userSeller,
    userManager,
    userAgent,
    userAdministrator,
    bank,
    analysis
  )

  notification = await factory.create(
    'Notification',
    {
      opened: false,
      process: process._id,
      buyer: userBuyer._id,
      phase: process.phases[0],
      administrator: userAdministrator._id,
      document: 'documento complementar'
    }
  )
})

describe('Notification', () => {
  it('1. deve retornar a notificação através do id do administrador', async () => {
    const response = await request(app)
      .get(`/notification?userId=${userAdministrator._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body[0]._id).toBe(notification._id.toString())
  })

  it('2. deve retornar erro caso id do administrador não seja passado', async () => {
    const response = await request(app)
      .get('/notification')
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe("Cannot read property 'isMaster' of null")
  })

  it('3. deve atualizar uma notificação como aberta', async () => {
    const response = await request(app)
      .put(`/notification/${notification._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)

    expect(response.body._id).toBe(notification._id.toString())
    expect(response.body.opened).toBe(true)
  })

  it('4. deve retornar erro ao tentar atualizar com id inválido', async () => {
    const response = await request(app)
      .put('/notification/9123')
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Cast to ObjectId failed for value \"9123\" (type string) at path \"_id\" for model \"notifications\"')
  })
})
