const redis = require('redis')
let blacklist

if (process.env.REDIS_KEY) {
  blacklist = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST,
    { tls: { servername: process.env.REDIS_HOST }, prefix: 'access-token-blacklist:' })
} else {
  blacklist = redis.createClient({ host: process.env.REDIS_HOST, prefix: 'access-token-blacklist:' })
}
const handleList = require('./handleList')
const handleBlacklist = handleList(blacklist)

const jwt = require('jsonwebtoken')
const { createHash } = require('crypto')

function generateTokenHash (token) {
  return createHash('sha256').update(token).digest('hex')
}

module.exports = {
  async add (token) {
    const expiration = jwt.decode(token).exp
    const tokenHash = generateTokenHash(token)
    await handleBlacklist.add(tokenHash, '', expiration)
  },
  async hasToken (token) {
    const tokenHash = generateTokenHash(token)
    return handleBlacklist.hasKey(tokenHash)
  }
}
