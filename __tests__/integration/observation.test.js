const { it, describe, expect, beforeAll, beforeEach } = require('@jest/globals')
const request = require('supertest')
const factory = require('../factories/observationFactory')
const userFactory = require('../factories/userFactory')
const bankFactory = require('../factories/bankFactory')
const analysisFactory = require('../factories/analysisFactory')
const commonMethods = require('../utils/commonMethods')

const app = require('../../src/app')

let observation

let userBuyer
let userSeller
let userManager
let userAgent
let userAdministrator
let bank
let analysis

let process

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

  observation = await factory.create('Observation')
})

describe('Observation', () => {
  it('1. deve criar nova Observação em uma fase', async () => {
    const response = await request(app)
      .post(`/observation/${process.phases[0]}`)
      .set('Authorization', loggedUser.token)
      .send({
        description: 'test',
        date: '05/09/2021'
      })

    expect(response.status).toBe(200)
    expect(response.body.description).toBe('test')
  })

  it('2. Não deve criar nova Observação em uma fase caso o id da fase seja invalido', async () => {
    const response = await request(app)
      .post('/observation/1')
      .set('Authorization', loggedUser.token)
      .send({
        description: 'test',
        date: '05/09/2021'
      })

    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
  })

  it('3. Não deve criar nova Observação em uma fase caso descrição não seja passada', async () => {
    const response = await request(app)
      .post(`/observation/${process.phases[0]}`)
      .set('Authorization', loggedUser.token)
      .send({
        date: '05/09/2021'
      })

    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
  })

  it('4. deve retornar observações de um processo', async () => {
    await request(app)
      .post(`/observation/${process.phases[0]}`)
      .set('Authorization', loggedUser.token)
      .send({
        description: 'test',
        date: '05/09/2021'
      })

    const response = await request(app)
      .get(`/observation/process/${process._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.phases[0].observation[0].description).toBe('test')
  })

  it('5. deve Atualizar os dados de uma Observação', async () => {
    const response = await request(app)
      .put(`/observation/${observation._id}`)
      .set('Authorization', loggedUser.token)
      .send({
        description: 'test update'
      })

    expect(response.status).toBe(200)
    expect(response.body.description).toBe('test update')
  })

  it('6. deve retornar erro ao tentar atualizar observação passando id inválido', async () => {
    const response = await request(app)
      .put('/observation/9999')
      .set('Authorization', loggedUser.token)
      .send({
        description: 'test update'
      })

    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
  })

  it('7. Deve deletar Observation', async () => {
    const newObservation = await factory.create('Observation', { description: 'Test Observation Delete' })
    const response = await request(app)
      .delete(`/observation/${newObservation._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.description).toBe('Test Observation Delete')
  })
})
