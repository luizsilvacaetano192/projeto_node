const { it, describe, expect, beforeAll, beforeEach } = require('@jest/globals')
const request = require('supertest')
const faker = require('faker-br')
const factory = require('../factories/realEstateFactory')
const userFactory = require('../factories/userFactory')
const realEstateApplicationFactory = require('../factories/realEstateApplicationFactory')
const commonMethods = require('../utils/commonMethods')

const app = require('../../src/app')

let realEstate
const loggedUser = {}

beforeAll(async () => {
  loggedUser.user = await userFactory.create('User', { isMaster: true })
  loggedUser.token = await commonMethods.logUser(loggedUser.user, app, request)
})

beforeEach(async () => {
  realEstate = await factory.create('RealEstate')
})

describe('RealEstate', () => {
  it('1. deve retornar a paginação de todos os Real Estates ativos', async () => {
    const response = await request(app)
      .get('/real-estate')
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.docs.length > 0).toBe(true)
  })

  it('2. deve retornar a paginação de Real Estates ativos com filtro', async () => {
    const response = await request(app)
      .get('/real-estate?limit=10&page=1&sortBy=createdAt&descending=false')
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.docs.length > 0).toBe(true)
    expect(response.body.docs[0]._id).toBe(realEstate.id)
  })

  it('3 deve criar um novo Real Estate', async () => {
    const response = await request(app)
      .post('/real-estate')
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Imobiliária Teste',
        CNPJ: faker.br.cnpj(),
        email: 'test@test.com',
        phone: '99999999999'
      })
    expect(response.status).toBe(201)
    expect(response.body.name).toBe('Imobiliária Teste')
    expect(response.body.active).toBe(true)
  })

  it('4. Deve retornar mensagem de erro na criação do Real Estate caso não sejam passado o nome', async () => {
    const response = await request(app)
      .post('/real-estate')
      .set('Authorization', loggedUser.token)
      .send({
        CNPJ: faker.br.cnpj(),
        email: 'test@test.com',
        phone: '99999999999'
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('realEstate validation failed: name: Path `name` is required.')
  })

  it('5. Deve retornar mensagem de erro na criação do Real Estate caso não sejam passado o CNPJ', async () => {
    const response = await request(app)
      .post('/real-estate')
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Imobiliária Teste',
        email: 'test@test.com',
        phone: '99999999999'
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('realEstate validation failed: CNPJ: Path `CNPJ` is required.')
  })

  it('6. Deve retornar mensagem de erro na criação do Real Estate caso não sejam passado o email', async () => {
    const response = await request(app)
      .post('/real-estate')
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Imobiliária Teste',
        CNPJ: faker.br.cnpj(),
        phone: '99999999999'
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('realEstate validation failed: email: Path `email` is required.')
  })

  it('7. Deve retornar mensagem de erro na criação do Real Estate caso CNPJ Inválido', async () => {
    const response = await request(app)
      .post('/real-estate')
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Imobiliária Teste',
        CNPJ: '8800767400016',
        email: 'test@test.com',
        phone: '99999999999'
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Este CNPJ não é valido')
  })

  it('8. Deve retornar mensagem de erro na criação do Real Estate caso CNPJ já cadastrado', async () => {
    const response = await request(app)
      .post('/real-estate')
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Imobiliária Teste',
        CNPJ: realEstate.CNPJ,
        email: 'test@test.com',
        phone: '99999999999'
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('CNPJ já cadastrado')
  })

  it('9. deve retornar os Real Estates pelo filtro de nome', async () => {
    const response = await request(app)
      .get(`/real-estate/search?text=${realEstate.name}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body[0]._id).toBe(realEstate.id)
    expect(response.body[0].name).toBe(realEstate.name)
  })

  it('10. deve retornar os Real Estates pelo id', async () => {
    const response = await request(app)
      .get(`/real-estate/${realEstate._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(realEstate._id.toString())
    expect(response.body.name).toBe(realEstate.name)
  })

  it('11. deve atualizar um Real Estate existente', async () => {
    const response = await request(app)
      .put(`/real-estate/${realEstate._id}`)
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Imobiliária Teste Update'
      })
    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Imobiliária Teste Update')
  })

  it('12. deve retornar mensagem de erro na atualização Real Estate caso CNPJ seja inválido', async () => {
    const response = await request(app)
      .put(`/real-estate/${realEstate._id}`)
      .set('Authorization', loggedUser.token)
      .send({
        CNPJ: '12345678910'
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Este CNPJ não é valido')
  })

  it('13. Deve deletar Real Estate', async () => {
    const newRealEstate = await factory.create('RealEstate', { name: 'Test Imobiliária Delete' })
    const response = await request(app)
      .delete(`/real-estate/${newRealEstate._id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Test Imobiliária Delete')
  })

  it('13. Deve Criar uma aplicação de imobiliária', async () => {
    const realEstateApplication = await realEstateApplicationFactory.create('RealEstateApplication')
    const response = await request(app)
      .post('/real-estate/application')
      .send({
        real_estate_name: realEstateApplication.real_estate_name,
        real_estate_liaison: realEstateApplication.real_estate_liaison,
        real_estate_phone: realEstateApplication.real_estate_phone,
        real_estate_email: realEstateApplication.real_estate_email,
        applicant_email: realEstateApplication.applicant_email,
        applicant_name: realEstateApplication.applicant_name
      })

    expect(response.status).toBe(200)
    expect(response.body.real_estate_name).toBe(realEstateApplication.real_estate_name)
    expect(response.body.real_estate_liaison).toBe(realEstateApplication.real_estate_liaison)
    expect(response.body.real_estate_phone).toBe(realEstateApplication.real_estate_phone)
    expect(response.body.real_estate_email).toBe(realEstateApplication.real_estate_email)
    expect(response.body.applicant_email).toBe(realEstateApplication.applicant_email)
    expect(response.body.applicant_name).toBe(realEstateApplication.applicant_name)
  })
})
