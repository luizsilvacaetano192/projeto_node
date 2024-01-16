require('dotenv').config({
  path: ['test', 'dev'].indexOf(process.env.NODE_ENV) !== -1 ? `.env.${process.env.NODE_ENV}` : '.env'
})
const mailTrapConfig = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}
module.exports = mailTrapConfig
