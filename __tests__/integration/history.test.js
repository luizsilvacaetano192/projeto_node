const { it, describe, expect, beforeAll, beforeEach } = require('@jest/globals')
const request = require('supertest')
const userFactory = require('../factories/userFactory')
const historyFactory = require('../factories/historyFactory')
const phaseFactory = require('../factories/phaseFactory')
const userRegisterfactory = require('../factories/userRegisterFactory')
const commonMethods = require('../utils/commonMethods')

const app = require('../../src/app')

let userRegister
let history
let phase

const loggedUser = {}

beforeAll(async () => {
  loggedUser.user = await userFactory.create('User', { isMaster: true })
  loggedUser.token = await commonMethods.logUser(loggedUser.user, app, request)
})

beforeEach(async () => {
  userRegister = await userRegisterfactory.create('UserRegister')
  history = await historyFactory.create('History', { phaseIdentificator: 1 })
  phase = await phaseFactory.create('Phase', { history: history._id })
})

describe('History', () => {
  it('1. deve criar um novo userRegister no history da phase', async () => {
    const response = await request(app)
      .post(`/history/${phase._id}`)
      .set('Authorization', loggedUser.token)
      .send({
        description: 'Test create userRegister',
        date: '05/09/2021'
      })
    expect(response.status).toBe(200)
    expect(response.body.description).toBe('Test create userRegister')
  })

  it('2. deve atualizar um userRegister', async () => {
    const response = await request(app)
      .put(`/history/${userRegister._id}`)
      .set('Authorization', loggedUser.token)
      .send({
        description: 'Test update userRegister'
      })
    expect(true).toBe(true)
    expect(response.status).toBe(200)
    expect(response.body._id).toBe(userRegister._id.toString())
    expect(response.body.description).toBe('Test description')
  })

  it('3. deve deletar um userRegister', async () => {
    const response = await request(app)
      .delete(`/history/${userRegister._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(userRegister._id.toString())
  })
})
