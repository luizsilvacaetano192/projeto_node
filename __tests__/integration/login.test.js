/* eslint-disable no-unused-vars */
const { it, describe, expect, beforeAll } = require('@jest/globals')
const request = require('supertest')
const userFactory = require('../factories/userFactory')
const realEstateFactory = require('../factories/realEstateFactory')

const app = require('../../src/app')

let user
let realEstate

const loggedUser = {}
let loginUser
const loggedRealEstate = {}
let loginRealEstate
beforeAll(async () => {
  user = await userFactory.create('User')
  loginUser = await request(app)
    .post('/login')
    .send({
      cpfCnpj: user.CPF,
      password: 'Password@123'
    })

  realEstate = await realEstateFactory.create('RealEstate')
  loginRealEstate = await request(app)
    .post('/login')
    .send({
      cpfCnpj: realEstate.CNPJ,
      password: 'Password@123'
    })
})

describe('Login', () => {
  it('1. Deve Logar usuários do tipo User', async () => {
    expect(loginUser.status).toBe(200)
    expect(loginUser.body.id).toBe(user._id.toString())
    expect(loginUser.body.logged).toBe(true)
    expect(loginUser.body.name).toBe(user.name)
    expect(loginUser.body.role).toBe(user.role)
  })

  it('2. Deve Logar usuários do tipo RealEstate', async () => {
    expect(loginRealEstate.status).toBe(200)
    expect(loginRealEstate.body.id).toBe(realEstate._id.toString())
    expect(loginRealEstate.body.logged).toBe(true)
    expect(loginRealEstate.body.name).toBe(realEstate.name)
    expect(loginRealEstate.body.role).toBe('REAL_ESTATE')
  })

  it('3. Deve Receber erro de autorização no login caso dados incorretos de User', async () => {
    const userLoginResponse = await request(app)
      .post('/login')
      .send({
        cpfCnpj: user.CPF,
        password: 'Password@122'
      })

    expect(userLoginResponse.status).toBe(401)
    expect(userLoginResponse.body.error).toBe(true)
    expect(userLoginResponse.body.message).toBe('Acesso não autorizado')

    const userLoginResponse2 = await request(app)
      .post('/login')
      .send()

    expect(userLoginResponse2.status).toBe(401)
    expect(userLoginResponse2.body.error).toBe(true)
    expect(userLoginResponse2.body.message).toBe('Acesso não autorizado')
  })

  it('4. Deve Receber erro de autorização no login caso dados incorretos de RealEstate', async () => {
    const realStateLoginResponse = await request(app)
      .post('/login')
      .send({
        cpfCnpj: realEstate.CNPJ,
        password: 'Password@12'
      })

    expect(realStateLoginResponse.status).toBe(401)
    expect(realStateLoginResponse.body.error).toBe(true)
    expect(realStateLoginResponse.body.message).toBe('Acesso não autorizado')

    const realStateLoginResponse2 = await request(app)
      .post('/login')
      .send({
        cpfCnpj: '123456789',
        password: 'Password@123'
      })

    expect(realStateLoginResponse2.status).toBe(401)
    expect(realStateLoginResponse2.body.error).toBe(true)
    expect(realStateLoginResponse2.body.message).toBe('Acesso não autorizado')
  })

  it('5. Deve receber token como parâmetro no corpo da requisição e relogar User já logado gerando novo token', async () => {
    const userRelog = await request(app)
      .post('/login/token')
      .send({
        token: loginUser.body.token
      })

    expect(userRelog.status).toBe(200)
    expect(userRelog.body.id).toBe(user._id.toString())
    expect(userRelog.body.logged).toBe(true)
    expect(userRelog.body.name).toBe(user.name)
    expect(userRelog.body.role).toBe(user.role)
  })

  it('6. Deve receber token como parâmetro no corpo da requisição e relogar RealEstate já logado gerando novo token', async () => {
    const realStateRelog = await request(app)
      .post('/login/token')
      .send({
        token: loginRealEstate.body.token
      })

    expect(realStateRelog.status).toBe(200)
    expect(realStateRelog.body.id).toBe(realEstate._id.toString())
    expect(realStateRelog.body.logged).toBe(true)
    expect(realStateRelog.body.name).toBe(realEstate.name)
    expect(realStateRelog.body.role).toBe('REAL_ESTATE')
  })

  it('7. Deve alterar a senha do usuário tipo User caso ele mesmo', async () => {
    const response = await request(app)
      .post('/login/new-password')
      .set('Authorization', loginUser.body.token)
      .send({
        id: loginUser.body.id,
        password: 'testePassword1'
      })

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(loginUser.body.id)

    // retorna a senha ao que era antes
    const returnResponse = await request(app)
      .post('/login/new-password')
      .set('Authorization', loginUser.body.token)
      .send({
        id: loginUser.body.id,
        password: 'Password@123'
      })

    expect(returnResponse.status).toBe(200)
    expect(returnResponse.body._id).toBe(loginUser.body.id)
  })

  it('8. Não Deve alterar a senha do usuário tipo User caso quem esteja alterando não tenha permissão', async () => {
    const response = await request(app)
      .post('/login/new-password')
      .set('Authorization', loginRealEstate.body.token)
      .send({
        id: loginUser.body.id,
        password: 'testePassword1'
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Acesso não autorizado')
  })

  it('9. Deve alterar a senha do usuário tipo Real Estate caso ele mesmo', async () => {
    const response = await request(app)
      .post('/login/new-password')
      .set('Authorization', loginRealEstate.body.token)
      .send({
        id: loginRealEstate.body.id,
        password: 'testePassword1'
      })

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(loginRealEstate.body.id)

    // retorna a senha ao que era antes
    const returnResponse = await request(app)
      .post('/login/new-password')
      .set('Authorization', loginRealEstate.body.token)
      .send({
        id: loginRealEstate.body.id,
        password: 'Password@123'
      })

    expect(returnResponse.status).toBe(200)
    expect(returnResponse.body._id).toBe(loginRealEstate.body.id)
  })

  it('10. Não Deve alterar a senha do usuário tipo Real Estate caso quem esteja alterando não tenha permissão', async () => {
    const response = await request(app)
      .post('/login/new-password')
      .set('Authorization', loginUser.body.token)
      .send({
        id: loginRealEstate.body.id,
        password: 'testePassword1'
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Acesso não autorizado')
  })
})
