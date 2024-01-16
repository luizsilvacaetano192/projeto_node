const { it, describe, expect, beforeAll, beforeEach } = require('@jest/globals')
const request = require('supertest')
const factory = require('../factories/bankFactory')
const userFactory = require('../factories/userFactory')
const commonMethods = require('../utils/commonMethods')

const app = require('../../src/app')

let bank

const loggedUser = {}

beforeAll(async () => {
  loggedUser.user = await userFactory.create('User', { isMaster: true })
  loggedUser.token = await commonMethods.logUser(loggedUser.user, app, request)
})

beforeEach(async () => {
  bank = await factory.create('Bank')
})

describe('Bank', () => {
  it('1. deve retornar a paginação de todos os bancos ativos', async () => {
    const response = await request(app)
      .get('/banks')
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.docs.length > 0).toBe(true)
    expect(response.body.docs[0]._id).toBe(bank.id)
  })

  it('2. deve criar um novo banco', async () => {
    const response = await request(app)
      .post('/banks')
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Banco Teste',
        commission: 0.01
      })

    expect(response.status).toBe(201)
    expect(response.body.name).toBe('Banco Teste')
    expect(response.body.commission).toBe(0.01)
    expect(response.body.commissionPercentage).toBe(1)
    expect(response.body.active).toBe(true)
  })

  it('3. Deve retornar mensagem de erro na criação do banco caso não sejam passado o nome', async () => {
    const response = await request(app)
      .post('/banks')
      .set('Authorization', loggedUser.token)
      .send({
        commission: 0.01
      })

    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('banks validation failed: name: Path `name` is required.')
  })

  it('4. Deve retornar mensagem de erro na criação do banco caso não sejam passada a comissão', async () => {
    const response = await request(app)
      .post('/banks')
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Banco Teste'
      })

    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('banks validation failed: commission: Path `commission` is required.')
  })

  it('5. Deve retornar mensagem de erro na criação do banco caso não sejam passados o nome e a comissão', async () => {
    const response = await request(app)
      .post('/banks')
      .set('Authorization', loggedUser.token)
      .send({})

    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('banks validation failed: commission: Path `commission` is required., name: Path `name` is required.')
  })

  it('6. deve atualizar um banco existente', async () => {
    const response = await request(app)
      .put(`/banks/${bank.id}`)
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Banco Update Teste',
        commission: 0.02
      })
    expect(response.status).toBe(200)
    expect(response.body.id).not.toBe(bank.id)
    expect(response.body.name).toBe('Banco Update Teste')
    expect(response.body.commission).toBe(0.02)
    expect(response.body.commissionPercentage).toBe(2)
    expect(response.body.active).toBe(true)
  })

  it('7. Deve retornar mensagem de erro na atualização do banco caso não sejam passado o nome', async () => {
    const response = await request(app)
      .put(`/banks/${bank.id}`)
      .set('Authorization', loggedUser.token)
      .send({
        commission: 0.01
      })

    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('banks validation failed: name: Path `name` is required.')
  })

  it('8. Deve retornar mensagem de erro na atualização do banco caso não sejam passada a comissão', async () => {
    const response = await request(app)
      .put(`/banks/${bank.id}`)
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Banco Teste'
      })

    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('banks validation failed: commission: Path `commission` is required.')
  })

  it('9. Deve retornar mensagem de erro na atualização do banco caso não sejam passados o nome e a comissão', async () => {
    const response = await request(app)
      .put(`/banks/${bank.id}`)
      .set('Authorization', loggedUser.token)
      .send({})

    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('banks validation failed: commission: Path `commission` is required., name: Path `name` is required.')
  })

  it('10. Deve deletar banco', async () => {
    const newBank = await factory.create('Bank', { name: 'Test Bank Delete' })
    const response = await request(app)
      .delete(`/banks/${newBank.id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(204)
  })

  it('11. Deve retornar erro ao tentar deletar banco inválido', async () => {
    const response = await request(app)
      .delete('/banks/test')
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(500)

    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Cast to ObjectId failed for value "test" (type string) at path "_id" for model "banks"')
  })

  it('12. não deve permitir que um usuario sem autorização crie um Banco', async () => {
    const notMasterLoggedUser = {}
    notMasterLoggedUser.user = await userFactory.create('User', { CPF: commonMethods.generateCpf() })
    notMasterLoggedUser.token = await commonMethods.logUser(notMasterLoggedUser.user, app, request)

    const response = await request(app)
      .post('/banks')
      .set('Authorization', notMasterLoggedUser.token)
      .send({
        name: 'Banco Teste',
        commission: 0.01
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Acesso não autorizado')
  })

  it('13. não deve permitir que um usuario sem autorização altere um Banco', async () => {
    const notMasterLoggedUser = {}
    notMasterLoggedUser.user = await userFactory.create('User', { CPF: commonMethods.generateCpf() })
    notMasterLoggedUser.token = await commonMethods.logUser(notMasterLoggedUser.user, app, request)

    const response = await request(app)
      .put(`/banks/${bank.id}`)
      .set('Authorization', notMasterLoggedUser.token)
      .send({
        name: 'Banco Update Teste',
        commission: 0.02
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Acesso não autorizado')
  })

  it('15. não deve permitir que um usuario sem autorização delete um Banco', async () => {
    const notMasterLoggedUser = {}
    notMasterLoggedUser.user = await userFactory.create('User', { CPF: commonMethods.generateCpf() })
    notMasterLoggedUser.token = await commonMethods.logUser(notMasterLoggedUser.user, app, request)

    const newBank = await factory.create('Bank', { name: 'Test Bank Delete' })
    const response = await request(app)
      .delete(`/banks/${newBank.id}`)
      .set('Authorization', notMasterLoggedUser.token)
      .send()

    expect(response.status).toBe(401)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Acesso não autorizado')
  })

  it('16. deve permitir que um usuario sem autorização delete um Banco busque paginação de bancos', async () => {
    const notMasterLoggedUser = {}
    notMasterLoggedUser.user = await userFactory.create('User', { CPF: commonMethods.generateCpf() })
    notMasterLoggedUser.token = await commonMethods.logUser(notMasterLoggedUser.user, app, request)

    const response = await request(app)
      .get('/banks')
      .set('Authorization', notMasterLoggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.docs.length > 0).toBe(true)
  })
})
