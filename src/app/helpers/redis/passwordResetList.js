const redis = require('redis')
let resetList

if (process.env.REDIS_KEY) {
  resetList = redis.createClient(6380, process.env.REDIS_HOST,
    { auth_pass: process.env.REDIS_KEY, tls: { servername: process.env.REDIS_HOST }, prefix: 'password-reset:' })
} else {
  resetList = redis.createClient({
    host: process.env.REDIS_HOST,
    prefix: 'password-reset:'
  })
}

const handleList = require('./handleList')

module.exports = handleList(resetList)
