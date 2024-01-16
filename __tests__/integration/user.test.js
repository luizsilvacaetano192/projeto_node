const { it, describe, expect, beforeAll, beforeEach } = require('@jest/globals')
const request = require('supertest')
const factory = require('../factories/userFactory')
const realEstateFactory = require('../factories/realEstateFactory')
const commonMethods = require('../utils/commonMethods')

const app = require('../../src/app')

let userFactory
const loggedUser = {}

beforeAll(async () => {
  loggedUser.user = await factory.create('User', { isMaster: true })
  loggedUser.token = await commonMethods.logUser(loggedUser.user, app, request)
})

beforeEach(async () => {
  userFactory = await factory.create('User')
})

describe('User', () => {
  it('1. deve retornar usuarios pelo filtro', async () => {
    const response = await request(app)
      .get(`/user?text=${userFactory.name}&role=${userFactory.role}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body[0].name).toBe(userFactory.name)
    expect(response.body[0].email).toBe(userFactory.email)
    expect(response.body[0].role).toBe(userFactory.role)
    expect(response.body[0].active).toBe(true)
  })

  it('2. deve retornar usuario pelo id', async () => {
    const response = await request(app)
      .get(`/user/${userFactory.id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.status).toBe(200)
    expect(response.body.name).toBe(userFactory.name)
    expect(response.body.email).toBe(userFactory.email)
    expect(response.body.active).toBe(true)
  })

  it('3. deve criar um novo usuario de role administrator', async () => {
    const response = await request(app)
      .post('/user/administrator')
      .set('Authorization', loggedUser.token)
      .send({
        CPF: commonMethods.generateCpf(),
        name: 'Teste Administrator',
        email: 'testeAdmin@test.com'
      })
    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Teste Administrator')
    expect(response.body.email).toBe('testeAdmin@test.com')
    expect(response.body.role).toBe('ADMINISTRATOR')
    expect(response.body.active).toBe(true)
  })

  it('4. deve criar um novo usuario de role manager', async () => {
    const response = await request(app)
      .post('/user/manager')
      .set('Authorization', loggedUser.token)
      .send({
        CPF: commonMethods.generateCpf(),
        name: 'Teste Administrator',
        email: 'testeAdmin@test.com'
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Teste Administrator')
    expect(response.body.email).toBe('testeAdmin@test.com')
    expect(response.body.role).toBe('MANAGER')
    expect(response.body.active).toBe(true)
  })

  it('5. deve criar um novo usuario de role seller', async () => {
    const response = await request(app)
      .post('/user/seller')
      .set('Authorization', loggedUser.token)
      .send({
        CPF: commonMethods.generateCpf(),
        name: 'Teste Administrator',
        email: 'testeAdmin@test.com'
      })
    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Teste Administrator')
    expect(response.body.email).toBe('testeAdmin@test.com')
    expect(response.body.role).toBe('SELLER')
    expect(response.body.active).toBe(true)
  })

  it('6. deve criar um novo usuario de role agent', async () => {
    const response = await request(app)
      .post('/user/agent')
      .set('Authorization', loggedUser.token)
      .send({
        CPF: commonMethods.generateCpf(),
        name: 'Teste Administrator',
        email: 'testeAdmin@test.com'
      })
    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Teste Administrator')
    expect(response.body.email).toBe('testeAdmin@test.com')
    expect(response.body.role).toBe('AGENT')
    expect(response.body.active).toBe(true)
  })

  it('7. deve retornar erro caso tente cadastrar usuário com role inválida', async () => {
    const response = await request(app)
      .post('/user/test')
      .set('Authorization', loggedUser.token)
      .send({
        CPF: commonMethods.generateCpf(),
        name: 'Teste Administrator',
        email: 'testeAdmin@test.com'
      })
    expect(response.status).toBe(422)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe("Role inválida. Valores possíveis: 'administrator', 'manager', 'seller', 'agent'")
  })

  it('8. deve retornar erro caso tente cadastrar usuário com CPF inválido', async () => {
    const response = await request(app)
      .post('/user/administrator')
      .set('Authorization', loggedUser.token)
      .send({
        CPF: '00484748',
        name: 'Teste Administrator',
        email: 'testeAdmin@test.com'
      })
    expect(response.status).toBe(400)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Este CPF não é valido')
  })

  it('9. deve retornar erro caso tente cadastrar usuário com CPF já existente', async () => {
    const CPF = commonMethods.generateCpf()

    await request(app)
      .post('/user/administrator')
      .set('Authorization', loggedUser.token)
      .send({
        CPF: CPF,
        name: 'Teste Administrator',
        email: 'testeAdmin@test.com'
      })

    const response = await request(app)
      .post('/user/administrator')
      .set('Authorization', loggedUser.token)
      .send({
        CPF: CPF,
        name: 'Teste Administrator',
        email: 'testeAdmin@test.com'
      })
    expect(response.status).toBe(400)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('CPF já cadastrado')
  })

  it('10. deve retornar erro caso tente cadastrar usuário sem passar nome', async () => {
    const response = await request(app)
      .post('/user/administrator')
      .set('Authorization', loggedUser.token)
      .send({
        CPF: commonMethods.generateCpf(),
        email: 'testeAdmin@test.com'
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('users validation failed: name: Path `name` is required.')
  })

  it('11. deve retornar erro caso tente cadastrar usuário sem passar email', async () => {
    const response = await request(app)
      .post('/user/administrator')
      .set('Authorization', loggedUser.token)
      .send({
        CPF: commonMethods.generateCpf(),
        name: 'Teste Administrator'
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('users validation failed: email: Path `email` is required.')
  })

  it('12. deve atualizar um usuario', async () => {
    const response = await request(app)
      .put(`/user/${userFactory.id}`)
      .set('Authorization', loggedUser.token)
      .send({
        name: 'Teste Administrator',
        email: 'testeAdmin@test.com'
      })
    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Teste Administrator')
    expect(response.body.email).toBe('testeAdmin@test.com')
    expect(response.body.active).toBe(true)
  })

  it('13. deve deletar um usuario', async () => {
    const response = await request(app)
      .delete(`/user/${userFactory.id}`)
      .set('Authorization', loggedUser.token)
      .send()
    expect(response.status).toBe(200)
    expect(response.body.name).toBe(userFactory.name)
    expect(response.body.email).toBe(userFactory.email)

    const responseGet = await request(app)
      .get(`/user/${userFactory.id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(responseGet.status).toBe(200)
    expect(responseGet.body.active).toBe(false)
  })

  it('14. deve retornar usuários paginados de acordo com o filtro', async () => {
    const response = await request(app)
      .get('/user-table?limit=10&page=1&sortBy=createdAt&descending=false')
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.docs.length > 0).toBe(true)
    expect(response.body.docs[0]._id).toBe(userFactory.id)
  })

  it('15. Deve retornar "Unauthorized" para chamada sem token', async () => {
    const response = await request(app)
      .get(`/user?text=${userFactory.name}&role=${userFactory.role}`)
      .send()
    expect(response.status).toBe(401)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Acesso não autorizado')
  })

  it('16. Deve retornar Erro para chamadas com token invalido', async () => {
    const response = await request(app)
      .get(`/user?text=${userFactory.name}&role=${userFactory.role}`)
      .set('Authorization', loggedUser.token.slice(0, -20))
      .send()

    expect(response.status).toBe(500)
  })

  it('17. não deve permitir que um usuario sem autorização crie usuários da role ADMINISTRATOR', async () => {
    const notMasterLoggedUser = {}
    notMasterLoggedUser.user = await factory.create('User', { CPF: commonMethods.generateCpf() })
    notMasterLoggedUser.token = await commonMethods.logUser(notMasterLoggedUser.user, app, request)

    const response = await request(app)
      .post('/user/administrator')
      .set('Authorization', notMasterLoggedUser.token)
      .send({
        CPF: commonMethods.generateCpf(),
        name: 'Teste Administrator',
        email: 'testeAdmin@test.com'
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Acesso não autorizado')
  })

  it('18. não deve permitir que um usuario sem autorização crie usuários da role SELLER', async () => {
    const notMasterLoggedUser = {}
    notMasterLoggedUser.user = await factory.create('User', { CPF: commonMethods.generateCpf() })
    notMasterLoggedUser.token = await commonMethods.logUser(notMasterLoggedUser.user, app, request)

    const response = await request(app)
      .post('/user/seller')
      .set('Authorization', notMasterLoggedUser.token)
      .send({
        CPF: commonMethods.generateCpf(),
        name: 'Teste Seller',
        email: 'testeSeller@test.com'
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Acesso não autorizado')
  })

  it('19. Deve permitir que um usuario sem autorização crie usuários da role MANAGER', async () => {
    const notMasterLoggedUser = {}
    notMasterLoggedUser.user = await factory.create('User', { CPF: commonMethods.generateCpf() })
    notMasterLoggedUser.token = await commonMethods.logUser(notMasterLoggedUser.user, app, request)

    const response = await request(app)
      .post('/user/manager')
      .set('Authorization', notMasterLoggedUser.token)
      .send({
        CPF: commonMethods.generateCpf(),
        name: 'Teste Manager',
        email: 'testeManager@test.com'
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Teste Manager')
    expect(response.body.email).toBe('testeManager@test.com')
    expect(response.body.role).toBe('MANAGER')
    expect(response.body.active).toBe(true)
  })

  it('20. Não deve permitir que um usuario delete seu proprio registro', async () => {
    const response = await request(app)
      .delete(`/user/${loggedUser.user.id}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(403)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Você não tem permissão para executar esta ação')
  })

  it('21. Registro de usuários do tipo AGENT e MANAGER sem necessidade de autenticação', async () => {
    const realEstate = await realEstateFactory.create('RealEstate')

    const managerResponse = await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '55633319036',
        email: 'selfUserTest@test.com',
        password: 'Password@123',
        phone: '51991818861',
        birthDate: '1988-10-31',
        role: 'manager',
        realEstate: realEstate._id
      })

    expect(managerResponse.status).toBe(200)
    expect(managerResponse.body.name).toBe('Test self added user')
    expect(managerResponse.body.email).toBe('selfUserTest@test.com')
    expect(managerResponse.body.role).toBe('MANAGER')
    expect(managerResponse.body.active).toBe(true)

    const agentResponse = await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '47785328056',
        email: 'selfUserTest@test.com',
        password: 'Password@123',
        phone: '51991818861',
        birthDate: '1988-10-31',
        role: 'agent',
        realEstate: realEstate._id
      })

    expect(agentResponse.status).toBe(200)
    expect(agentResponse.body.name).toBe('Test self added user')
    expect(agentResponse.body.email).toBe('selfUserTest@test.com')
    expect(agentResponse.body.role).toBe('AGENT')
    expect(agentResponse.body.active).toBe(true)
  })

  it('22. Não deve permitir nome com menos de 2 caracteres', async () => {
    const realEstate = await realEstateFactory.create('RealEstate')

    const response = await request(app)
      .post('/user')
      .send({
        name: 'T',
        CPF: '48197421080',
        email: 'selfUserTest@test.com',
        password: 'Password@123',
        phone: '51991818861',
        birthDate: '1988-10-31',
        role: 'manager',
        realEstate: realEstate._id
      })

    expect(response.status).toBe(422)
    expect(response.body.errors[0].name).toBe('Nome precisa ter ao menos 2 caracteres')
  })

  it('23. Não deve permitir CPF inválido', async () => {
    const realEstate = await realEstateFactory.create('RealEstate')

    const response = await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '481974210',
        email: 'selfUserTest@test.com',
        password: 'Password@123',
        phone: '51991818861',
        birthDate: '1988-10-31',
        role: 'manager',
        realEstate: realEstate._id
      })

    expect(response.status).toBe(422)
    expect(response.body.errors[0].CPF).toBe('Este CPF não é valido')
  })

  it('24. Não deve permitir CPF já registrado', async () => {
    const realEstate = await realEstateFactory.create('RealEstate')

    await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '48197421080',
        email: 'selfUserTest@test.com',
        password: 'Password@123',
        phone: '51991818861',
        birthDate: '1988-10-31',
        role: 'manager',
        realEstate: realEstate._id
      })

    const response = await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '48197421080',
        email: 'selfUserTest@test.com',
        password: 'Password@123',
        phone: '51991818861',
        birthDate: '1988-10-31',
        role: 'manager',
        realEstate: realEstate._id
      })

    expect(response.status).toBe(422)
    expect(response.body.errors[0].CPF).toBe('CPF já cadastrado')
  })

  it('25. Não deve permitir email inválido', async () => {
    const realEstate = await realEstateFactory.create('RealEstate')

    const response = await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '19627211087',
        email: 'selfUserTest',
        password: 'Password@123',
        phone: '51991818861',
        birthDate: '1988-10-31',
        role: 'manager',
        realEstate: realEstate._id
      })

    expect(response.status).toBe(422)
    expect(response.body.errors[0].email).toBe('O email precisa ser válido')
  })

  it('26. Não deve permitir password inválido', async () => {
    const realEstate = await realEstateFactory.create('RealEstate')

    const response = await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '67148621054',
        email: 'selfUserTest@test.com',
        password: 'Password',
        phone: '51991818861',
        birthDate: '1988-10-31',
        role: 'manager',
        realEstate: realEstate._id
      })

    expect(response.status).toBe(422)
    expect(response.body.errors[0].password).toBe('A senha deve conter 6 caracteres e ao menos uma letra maiúscula, uma letra minúscula e um número ou caractere especial')
  })

  it('27. Caso seja passado Não deve permitir phone inválido', async () => {
    const realEstate = await realEstateFactory.create('RealEstate')

    const response = await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '40480265003',
        email: 'selfUserTest@test.com',
        password: 'Password@123',
        phone: '51991818',
        birthDate: '1988-10-31',
        role: 'manager',
        realEstate: realEstate._id
      })

    expect(response.status).toBe(422)
    expect(response.body.errors[0].phone).toBe('Número de telefone inválido')
  })

  it('28. Caso seja passado Não deve permitir birthDate em formato inválido', async () => {
    const realEstate = await realEstateFactory.create('RealEstate')

    const response = await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '75985947084',
        email: 'selfUserTest@test.com',
        password: 'Password@123',
        phone: '51991818861',
        birthDate: '31/10/1988',
        role: 'manager',
        realEstate: realEstate._id
      })

    expect(response.status).toBe(422)
    expect(response.body.errors[0].birthDate).toBe('birthdate precisa ser valido e no formato [YYYY-MM-DD]')
  })

  it('29. Não deve permitir role inválido', async () => {
    const realEstate = await realEstateFactory.create('RealEstate')

    const response = await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '45207627074',
        email: 'selfUserTest@test.com',
        password: 'Password@123',
        phone: '51991818861',
        birthDate: '1988-10-31',
        role: 'administrator',
        realEstate: realEstate._id
      })

    expect(response.status).toBe(422)
    expect(response.body.errors[0].role).toBe("Role inválida. Valores possíveis: 'manager', 'agent'")
  })

  it('30. Não deve permitir realEstate inválida', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        name: 'Test self added user',
        CPF: '41905826036',
        email: 'selfUserTest@test.com',
        password: 'Password@123',
        phone: '51991818861',
        birthDate: '1988-10-31',
        role: 'manager',
        realEstate: '617df40d5f3529077284903d'
      })

    expect(response.status).toBe(422)
    expect(response.body.errors[0].realEstate).toBe('realEstate não encontrada')
  })
})
