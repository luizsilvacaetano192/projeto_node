/* eslint-disable no-useless-escape */
const { it, describe, expect, beforeAll, beforeEach } = require('@jest/globals')
const request = require('supertest')
const { resolve } = require('path')
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

describe('Phase', () => {
  it('1. Deve retornar phase por id', async () => {
    const response = await request(app)
      .get(`/phase/${process.phases[0]}`)
      .set('Authorization', loggedUser.token)
      .send()
    expect(response.status).toBe(200)
    expect(response.body._id).toBe(process.phases[0].toString())
  })

  it('2. Deve atualizar uma phase', async () => {
    const response = await request(app)
      .put(`/phase/${process.phases[0]}/save`)
      .set('Authorization', loggedUser.token)
      .send({
        detail:
            {
              buyer: userBuyer._id,
              seller: userSeller._id
            },
        status: {
          creditAnalysis: true
        }
      })

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(process.phases[0].toString())
  })

  it('3. Deve atualizar e finalizar uma phase', async () => {
    const response = await request(app)
      .put(`/phase/${process.phases[1]}/finish`)
      .set('Authorization', loggedUser.token)
      .send({
        detail:
          {
            buyer: userBuyer._id,
            seller: userSeller._id
          },
        status: {
          creditAnalysis: true
        }
      })
    expect(response.status).toBe(200)
    expect(response.body._id).toBe(process.phases[1].toString())
  })

  it('4. Deve retornar erro se enviar tipo inválido', async () => {
    const response = await request(app)
      .put(`/phase/${process.phases[1]}/finished`)
      .set('Authorization', loggedUser.token)
      .send({
        detail:
          {
            buyer: userBuyer._id,
            seller: userSeller._id
          },
        status: {
          creditAnalysis: true
        }
      })
    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe("Type inválido. Valores possíveis: 'save', 'finish'")
  })

  it('5. Deve realizar o upload de um arquivo e anexá-lo a phase', async () => {
    const response = await request(app)
      .post(`/upload/process/phase/${process.phases[0]}`)
      .set('Authorization', loggedUser.token)
      .set('Content-Type', 'multipart/form-data')
      .field('idProcess', `${process._id}`)
      .field('complementar', 'false')
      .field('fieldName', 'teste')
      .attach('archives', resolve(__dirname, '..', 'utils', 'teste.svg'))

    const phase = await request(app)
      .get(`/phase/${process.phases[0]}`)
      .set('Authorization', loggedUser.token)
      .send()

    expect(response.status).toBe(200)
    expect(phase.body.docs.length).toBe(1)
  })

  it('6. Deve falhar no upload caso arquivo não seja enviado', async () => {
    const response = await request(app)
      .post(`/upload/process/phase/${process.phases[0]}`)
      .set('Authorization', loggedUser.token)
      .set('Content-Type', 'multipart/form-data')
      .field('idProcess', `${process._id}`)
      .field('complementar', 'false')
      .field('fieldName', 'teste')

    expect(response.status).toBe(500)
    expect(response.body.error).toBe(true)
    expect(response.body.message).toBe('Não foi possível localizar o arquivo!')
  })

  it('7. Deve atualizar o campo downloaded de arquivos de uma fase sob o nameField passado', async () => {
    await request(app)
      .post(`/upload/process/phase/${process.phases[1]}`)
      .set('Authorization', loggedUser.token)
      .set('Content-Type', 'multipart/form-data')
      .field('idProcess', `${process._id}`)
      .field('complementar', 'false')
      .field('fieldName', 'Teste')
      .attach('archives', resolve(__dirname, '..', 'utils', '.svg'))

    const response = await request(app)
      .put(`/download-document/${process.phases[1]}?fieldName=Teste`)
      .set('Authorization', loggedUser.token)
      .send({
        downloaded: true
      })

    // check if all docs under the nameField had their downloaded set to the given value
    let flag = false
    if (response.status === 200) {
      const filteredDocs = response.body.docs.filter(doc => doc.fieldName === 'Teste')
      filteredDocs.filter((doc) => {
        if (doc.downloaded === true) {
          flag = true
        } else {
          flag = false
        }
        return doc
      })
    }

    expect(response.status).toBe(200)
    expect(flag).toBe(true)
  })

  it('8. Deve retornar erro ao tentar atualizar o campo downloaded de arquivos de uma fase com id da fase inválido', async () => {
    const response = await request(app)
      .put('/download-document/999?fieldName=Teste')
      .set('Authorization', loggedUser.token)
      .send({
        downloaded: true
      })

    expect(response.status).toBe(500)

    expect(response.body.message).toBe('Cast to ObjectId failed for value \"999\" at path \"_id\" for model \"phases\"')
  })

  it('9. Deve retornar erro ao tentar atualizar o campo downloaded de arquivos de uma fase com fieldName não existente', async () => {
    const response = await request(app)
      .put(`/download-document/${process.phases[1]}?fieldName=Jonas`)
      .set('Authorization', loggedUser.token)
      .send({
        downloaded: true
      })

    expect(response.status).toBe(500)
    expect(response.body.message).toBe("Cannot set property 'downloaded' of undefined")
  })

  it('10. Deve retornar erro ao tentar atualizar o campo downloaded de arquivos de uma fase com downloaded inválido', async () => {
    const response = await request(app)
      .put(`/download-document/${process.phases[1]}?fieldName=Teste`)
      .set('Authorization', loggedUser.token)
      .send({
        downloaded: 'Teste'
      })

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('downloaded inválido. Valores possíveis: true or false')
  })
})
