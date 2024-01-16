require('dotenv').config({
  path: ['test', 'dev','production'].indexOf(process.env.NODE_ENV) !== -1 ? `.env.${process.env.NODE_ENV}` : '.env'
})
const rdStationConfig = {
  host: process.env.CRM_HOST,
  auth: {
    client_id: process.env.CRM_CLIENT_ID,
    client_secret: process.env.CRM_SECRET_CLIENT
  },
  // active: true
  active: true//JSON.parse(process.env.CRM_INTEGRATION_TOGGLER)
}
module.exports = rdStationConfig
