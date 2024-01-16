const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { DateTime } = require('luxon')

const { InvalidArgumentError } = require('../middlewares/errors')

const refreshTokenWhitelist = require('./redis/refreshTokenWhitelist')
const accessTokenBlacklist = require('./redis/accessTokenBlacklist')
const passwordResetList = require('./redis/passwordResetList')

function createJWT (id, [timeAmount, timeUnit]) {
  const payload = { id }
  const token = jwt.sign(payload, process.env.APP_SECRET, {
    expiresIn: timeAmount + timeUnit
  })
  return token
}

async function checkJWT (token, name, blacklist) {
  await checkBlacklist(token, name, blacklist)
  const { id } = jwt.verify(token, process.env.APP_SECRET)
  return id
}

async function checkBlacklist (token, name, blacklist) {
  if (!blacklist) {
    return
  }

  const blToken = await blacklist.hasToken(token)
  if (blToken) {
    throw new jwt.JsonWebTokenError(`${name} invalidado por logout`)
  }
}

function invalidateJWT (token, blacklist) {
  return blacklist.add(token)
}

async function createOpaqueToken (id, [timeAmount, timeUnit], whitelist) {
  const token = crypto.randomBytes(24).toString('hex')
  const expiration = DateTime.now().plus({ [timeUnit]: timeAmount })
  await whitelist.add(token, id, Math.round(expiration.toMillis() / 1000))
  return token
}

async function checkOpaqueToken (token, name, whitelist) {
  checkSentToken(token, name)
  const id = await whitelist.search(token)
  checkValidToken(id, name)
  return id
}

async function invalidateOpaqueToken (token, whitelist) {
  await whitelist.delete(token)
}

function checkValidToken (id, name) {
  if (!id) {
    throw new InvalidArgumentError(`${name} inválido!`)
  }
}

function checkSentToken (token, name) {
  if (!token) {
    throw new InvalidArgumentError(`${name} não enviado!`)
  }
}

module.exports = {
  access: {
    name: 'access token',
    list: accessTokenBlacklist,
    expiration: [10080, 'minutes'],
    create (id) {
      return createJWT(id, this.expiration)
    },
    check (token) {
      return checkJWT(token, this.name, this.list)
    },
    invalidate (token) {
      return invalidateJWT(token, this.list)
    }
  },
  refresh: {
    name: 'refresh token',
    list: refreshTokenWhitelist,
    expiration: [5, 'days'],
    create (id) {
      return createOpaqueToken(id, this.expiration, this.list)
    },
    check (token) {
      return checkOpaqueToken(token, this.name, this.list)
    },
    invalidate (token) {
      return invalidateOpaqueToken(token, this.list)
    }
  },
  checkEmail: {
    name: 'token de verificação de e-mail',
    expiration: [3, 'days'],
    create (id) {
      return createJWT(id, this.expiration)
    },
    check (token) {
      return checkJWT(token, this.name)
    }
  },
  passwordReset: {
    name: 'token de redefinição de senha',
    list: passwordResetList,
    expiration: [1, 'hours'],
    create (id) {
      return createOpaqueToken(id, this.expiration, this.list)
    },
    check (token) {
      return checkOpaqueToken(token, this.name, this.list)
    },
    invalidate (token) {
      return invalidateOpaqueToken(token, this.list)
    }
  }
}
