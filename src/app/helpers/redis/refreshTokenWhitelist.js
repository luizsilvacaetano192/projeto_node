const redis = require('redis')
const handleList = require('./handleList')

let whitelist

if (process.env.REDIS_KEY) {
  whitelist = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST,
    { tls: { servername: process.env.REDIS_HOST }, prefix: 'refresh-token-whitelist:' })
} else {
  whitelist = redis.createClient({ host: process.env.REDIS_HOST, prefix: 'refresh-token-whitelist:' })
}

module.exports = handleList(whitelist)
