/* eslint-disable camelcase */
const Services = require('./Services')
const axios = require('axios')
const rdStationConfig = require('../../config/rdStation')
const externalTokensModel = require('../models/externaltokens')
const { InternalServerError } = require('../middlewares/errors')

class RdStationIntegrationService extends Services {
  constructor () {
    super(
      'messages',
      'Mensagem'
    )
  }

  /*
  {storeAuthCode}
    No Fluxo de autenticação do RD-Station
    quando desejamos coletar um novo code de autenticação
    é necessário termos um endpoint que receba a chamada de callback feita pelo serviço.

    Para gerar uma chamada que cairá aqui, deve-se registrar o endpoint desta API na App Store do RD e bater na URL
    https://api.rd.services/auth/dialog?client_id={client_id}&redirect_uri={redirect_uri}

    O RD então fará a chamada passando o code através de query string.
    Este code tem duração de 1h e poderá ser usado para se gerar um access e refresh token.
  */
  async storeAuthCode (code) {
    if (!rdStationConfig.active) {
      return true
    }
    try {
      if (!process.env.CRM_CALLBACK_TOGGLER) {
        throw new InternalServerError('Endpoint de callback desativado')
      }
      if (!code) {
        throw new InternalServerError('Code não foi passado')
      }

      // checa na collection de externalTokensModel por service === RD-station.
      const rdTokens = await externalTokensModel.findOne({ service: 'rdstation' })
      // cria serviço caso não exista.
      if (!rdTokens) {
        return await externalTokensModel.create({ service: 'rdstation', tokens: { code: code } })
      }
      // ou atualiza service com codigo.
      return externalTokensModel.findByIdAndUpdate(
        rdTokens.id,
        { tokens: { code: code } },
        { new: true }
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /*
  {refreshAccessToken}
    Este método gera um par access e refresh token através da URL.
    POST: https://api.rd.services/auth/token

    Quando temos um code coletado através da chamada callback do RD Station
    ainda não possuimos um refresh token,
    O método fará a chamada que gerará o primeiro access_token e refresh_token
    passando o code como parâmetro.

    Quando já possuimos um refresh_token,
    realizará a chamada passando o refresh_token atual e gerando um novo par.
  */
  async refreshAccessToken () {
    if (!rdStationConfig.active) {
      return true
    }
    try {
      const rdTokens = await externalTokensModel.findOne({ service: 'rdstation' })

      if (!rdTokens) {
        throw new InternalServerError('Tokens do RD station não foram encontrados')
      }

      const rdCodes = {
        client_id: rdStationConfig.auth.client_id,
        client_secret: rdStationConfig.auth.client_secret
      }
      if (rdTokens.tokens.code) {
        rdCodes.code = rdTokens.tokens.code
      } else if (rdTokens.tokens.refresh_token) {
        rdCodes.refresh_token = rdTokens.tokens.refresh_token
      } else {
        throw new InternalServerError('Tokens do RD station não foram encontrados')
      }
      const { status, data } = await axios.post(`${rdStationConfig.host}auth/token`, rdCodes)

      if (status === 200) {
        const { access_token, refresh_token } = data
        rdTokens.tokens = { access_token, refresh_token }
        await externalTokensModel.findByIdAndUpdate(rdTokens.id, rdTokens, { new: true })

        return access_token
      } else {
        throw new InternalServerError('Não foi possivel se conectar ao RD Station')
      }
    } catch (error) {
      console.error(error)
      return error
    }
  }

  // https://developers.rdstation.com/en/reference/events#events-post
  async convertLeadIntoEvent (event) {
    if (!rdStationConfig.active) {
      return true
    }
    try {
      const rdTokens = await externalTokensModel.findOne({ service: 'rdstation' })

      if (typeof rdTokens.tokens.access_token === 'undefined') {
        if (typeof rdTokens.tokens.refresh_token === 'undefined') {
          throw new InternalServerError('access_token e refresh_token não encontrados')
        }
        rdTokens.tokens.access_token = await this.refreshAccessToken()
      }

      const { status, data } = await axios.post(
        `${rdStationConfig.host}platform/events`,
        event,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rdTokens.tokens.access_token}`
          }
        }
      )
      if (status === 200) {
        const message = {
          type: 'leadConversion',
          to: event.payload.email,
          from: 'rdStation',
          subject: `Lead '${event.payload.name}' converted into event '${event.payload.conversion_identifier}'`,
          message: `Lead '${event.payload.name}' converted into event '${event.payload.conversion_identifier}'`,
          response_payload: JSON.stringify(data)
        }
        await this.create(message)
      } else {
        throw new InternalServerError('Não foi possivel se conectar ao RD Station')
      }
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = RdStationIntegrationService
