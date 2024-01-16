const redis = require('redis')
const handleList = require('./handleList')

let whitelist

if (process.env.REDIS_KEY) {
  whitelist = redis.createClient(6380, process.env.REDIS_HOST,
    { auth_pass: process.env.REDIS_KEY, tls: { servername: process.env.REDIS_HOST }, prefix: 'refresh-token-whitelist:' })
} else {
  whitelist = redis.createClient({ host: process.env.REDIS_HOST, prefix: 'refresh-token-whitelist:' })
}

module.exports = handleList(whitelist)
