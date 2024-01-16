const { it, describe, expect, beforeAll, beforeEach } = require('@jest/globals')
const request = require('supertest')
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
})

describe('Process', () => {
  it('1. deve cadastrar um novo processo', async () => {
    const response = await request(app)
      .post('/process')
      .set('Authorization', loggedUser.token)
      .send({
        bank: bank._id,
        buyer: {
          name: userBuyer.name,
          CPF: userBuyer.CPF,
          email: userBuyer.email,
          phone: userBuyer.phone
        },
        manager: userManager._id,
        agent: userAgent._id,
        seller: {
          name: userSeller.name,
          CPF: userSeller.CPF,
          email: userSeller.email,
          phone: userSeller.phone
        },
        detail: {
          bank: null,
          bankAgency: null,
          CCA: null,
          immobileValue: null,
          buyAndSell: null,
          dispatchValue: null,
          financedValue: 150000,
          status: null,
          valueAproved: null,
          financedPercentage: null
        },
        status: { creditAnalysis: false },
        idAnalysis: analysis._id,
        administratorId: userAdministrator._id,
        agentCommission: 0.06
      })

    expect(response.status).toBe(200)
    expect(response.body.buyer).toBe(userBuyer._id.toString())
    expect(response.body.seller).toBe(userSeller._id.toString())
    expect(response.body.responsible).toBe(userAdministrator._id.toString())
    expect(response.body.manager).toBe(userManager._id.toString())
    expect(response.body.agent).toBe(userAgent._id.toString())
    expect(response.body.bank).toBe(bank._id.toString())
  })

  it('2. Deve retornar erro ao tentar cadastrar processo com CPF do Comprador Inválido', async () => {
    const response = await request(app)
      .post('/process')
      .set('Authorization', loggedUser.token)
      .send({
        bank: bank._id,
        buyer: {
          name: userBuyer.name,
          CPF: '12345678910',
          email: userBuyer.email,
          phone: userBuyer.phone
        },
        manager: userManager._id,
        agent: userAgent._id,
        seller: {
          name: userSeller.name,
          CPF: userSeller.CPF,
          email: userSeller.email,
          phone: userSeller.phone
        },
        detail: {
          bank: null,
          bankAgency: null,
          CCA: null,
          immobileValue: null,
          buyAndSell: null,
          dispatchValue: null,
          financedValue: 150000,
          status: null,
          valueAproved: null,
          financedPercentage: null
        },
        status: { creditAnalysis: false },
        idAnalysis: analysis._id,
        administratorId: userAdministrator._id,
        agentCommission: 0.06
      })

    expect(response.status).toBe(422)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('O CPF do comprador não é valido')
  })

  it('3. Deve retornar erro ao tentar cadastrar processo com administrador inválido', async () => {
    const response = await request(app)
      .post('/process')
      .set('Authorization', loggedUser.token)
      .send({
        bank: bank._id,
        buyer: {
          name: userBuyer.name,
          CPF: userBuyer.CPF,
          email: userBuyer.email,
          phone: userBuyer.phone
        },
        manager: userManager._id,
        agent: userAgent._id,
        seller: {
          name: userSeller.name,
          CPF: userSeller.CPF,
          email: userSeller.email,
          phone: userSeller.phone
        },
        detail: {
          bank: null,
          bankAgency: null,
          CCA: null,
          immobileValue: null,
          buyAndSell: null,
          dispatchValue: null,
          financedValue: 150000,
          status: null,
          valueAproved: null,
          financedPercentage: null
        },
        status: { creditAnalysis: false },
        idAnalysis: analysis._id,
        administratorId: userBuyer._id,
        agentCommission: 0.06
      })

    expect(response.status).toBe(422)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Somente administradores podem cadastrar um processo')
  })

  it('4. deve retornar process por id', async () => {
    const response = await request(app)
      .get(`/process/${process._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.value).toBe(process.value)
    expect(response.body.phases[0]._id).toBe(process.phases[0].toString())
    expect(response.body.bank._id).toBe(process.bank.toString())
  })

  it('5. deve retornar process por id do usuário Buyer', async () => {
    const response = await request(app)
      .get(`/process/user/${process.buyer}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body[0].value).toBe(process.value)
    expect(response.body[0].bank._id).toBe(process.bank.toString())
    expect(response.body[0].buyer._id).toBe(process.buyer.toString())
  })

  it('6. deve retornar process por id do usuário Seller', async () => {
    const response = await request(app)
      .get(`/process/user/${process.seller}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body[0].value).toBe(process.value)
    expect(response.body[0].bank._id).toBe(process.bank.toString())
    expect(response.body[0].seller._id).toBe(process.seller.toString())
  })

  it('7. deve retornar process por id do usuário Manager', async () => {
    const response = await request(app)
      .get(`/process/user/${process.manager}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body[0].value).toBe(process.value)
    expect(response.body[0].bank._id).toBe(process.bank.toString())
    expect(response.body[0].manager._id).toBe(process.manager.toString())
  })

  it('8. deve retornar process por id do usuário Agent', async () => {
    const response = await request(app)
      .get(`/process/user/${process.agent}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body[0].value).toBe(process.value)
    expect(response.body[0].bank._id).toBe(process.bank.toString())
    expect(response.body[0].agent._id).toBe(process.agent.toString())
  })

  it('9. deve retornar quantidade de process que tem relação com o id do buyer passado', async () => {
    const response = await request(app)
      .get(`/process/buyer/${process.buyer}/count`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.count).toBe(1)
  })

  it('10. deve retornar processos paginados de acordo com filtros passados na query string', async () => {
    const response = await request(app)
      .get(`/process-home?limit=10&page=1&sortBy=createdAt&descending=false&administratorId=${userAdministrator._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.docs[0]._id).toBe(process._id.toString())
  })

  it('11. deve retornar processos paginados de acordo com filtros passados na query string v2', async () => {
    const response = await request(app)
      .get(`/process?limit=1&page=1&sortBy=createdAt&descending=false&bank=${process.bank}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.docs[0]._id).toBe(process._id.toString())
  })

  it('12. deve histórico do processo', async () => {
    const response = await request(app)
      .get(`/process/${process._id}/history`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body[0]._id).toBe(1)
  })

  it('13. deve deletar um processo', async () => {
    const response = await request(app)
      .delete(`/process/${process._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(process._id.toString())
  })
})
