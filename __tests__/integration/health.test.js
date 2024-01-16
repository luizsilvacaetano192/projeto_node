const { it, describe, expect } = require('@jest/globals')
const request = require('supertest')

const app = require('../../src/app')

describe('Health', () => {
  it('1. deve retornar mensagem de OK', async () => {
    const response = await request(app)
      .get('/health')
      .send()

    expect(response.status).toBe(200)
    expect(response.body.status).toBe(200)
    expect(response.body.message).toBe('OK')
  })
})
