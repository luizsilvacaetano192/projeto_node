const { it, describe, expect, beforeAll, beforeEach } = require('@jest/globals')
const request = require('supertest')
const userFactory = require('../factories/userFactory')
const factory = require('../factories/analysisFactory')
const commonMethods = require('../utils/commonMethods')

const app = require('../../src/app')

let user
let analysisFactory

const loggedUser = {}

beforeAll(async () => {
  loggedUser.user = await userFactory.create('User', { isMaster: true })
  loggedUser.token = await commonMethods.logUser(loggedUser.user, app, request)
})

beforeEach(async () => {
  user = await userFactory.create('User', { role: 'MANAGER' })
  analysisFactory = await factory.create('Analysis', { manager: user._id })
})

describe('Analysis', () => {
  it('1. deve retornar analysis pelo filtro', async () => {
    const response = await request(app)
      .get('/analysis?limit=2&page=1&sortBy=createdAt&descending=false')
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.docs[0].buyer.CPF).toBe(analysisFactory.buyer.CPF)
    expect(response.body.docs[0].value).toBe(analysisFactory.value)
  })

  it('2. deve criar uma nova analise', async () => {
    const response = await request(app)
      .post('/analysis')
      .set('Authorization', loggedUser.token)
      .send({
        buyer: { CPF: '94319884027' },
        immobileValue: 250000,
        requestUserId: user._id
      })
    expect(response.status).toBe(200)
    expect(response.body.active).toBe(true)
    expect(response.body.buyer.CPF).toBe('94319884027')
    expect(response.body.value).toBe(250000)
  })

  it('3. deve retornar erro ao tentar criar uma nova analise sem passar buyer', async () => {
    const response = await request(app)
      .post('/analysis')
      .set('Authorization', loggedUser.token)
      .send({
        immobileValue: 250000,
        requestUserId: user._id
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe("Cannot destructure property `CPF` of 'undefined' or 'null'.")
  })

  it('4. deve retornar erro ao tentar criar uma nova analise passando CPF invalido', async () => {
    const response = await request(app)
      .post('/analysis')
      .set('Authorization', loggedUser.token)
      .send({
        buyer: { CPF: '94319884' },
        immobileValue: 250000,
        requestUserId: user._id
      })
    expect(response.status).toBe(400)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Favor informar um CPF válido')
  })

  it('5. deve retornar erro ao tentar criar uma nova analise sem passar requestUserId', async () => {
    const response = await request(app)
      .post('/analysis')
      .set('Authorization', loggedUser.token)
      .send({
        buyer: { CPF: '94319884027' },
        immobileValue: 250000
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe("Cannot read property 'role' of null")
  })

  it('6. deve retornar erro ao tentar criar uma nova analise passando um id usuário com role não permitida', async () => {
    const userSeller = user = await userFactory.create('User', { role: 'SELLER' })

    const response = await request(app)
      .post('/analysis')
      .set('Authorization', loggedUser.token)
      .send({
        buyer: { CPF: '94319884027' },
        immobileValue: 250000,
        requestUserId: userSeller._id
      })
    expect(response.status).toBe(400)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Somente corretores e gerentes podem enviar novas análises')
  })

  it('7. deve retornar Analysis por id', async () => {
    const response = await request(app)
      .get(`/analysis/${analysisFactory._id}`)
      .set('Authorization', loggedUser.token)
      .send()
    expect(response.status).toBe(200)
    expect(response.body.buyer.CPF).toBe(analysisFactory.buyer.CPF)
    expect(response.body.value).toBe(analysisFactory.value)
  })

  it('7. deve deletar uma analysis Analysis', async () => {
    const response = await request(app)
      .delete(`/analysis/${analysisFactory._id}`)
      .set('Authorization', loggedUser.token)
      .send()
    expect(response.status).toBe(200)
    expect(response.body.buyer.CPF).toBe(analysisFactory.buyer.CPF)
    expect(response.body.value).toBe(analysisFactory.value)

    const deleted = await request(app)
      .get(`/analysis/${analysisFactory._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(deleted.body.buyer.CPF).toBe(analysisFactory.buyer.CPF)
    expect(deleted.body.value).toBe(analysisFactory.value)
    expect(deleted.body.active).toBe(false)
  })
})
