const historyFactory = require('../factories/historyFactory')
const phaseFactory = require('../factories/phaseFactory')
const processFactory = require('../factories/processFactory')
const { cpf } = require('cpf-cnpj-validator')

function generateCpf () {
  const num1 = randomNumber().toString()
  const num2 = randomNumber().toString()
  const num3 = randomNumber().toString()

  const dig1 = createDigit(num1, num2, num3)
  const dig2 = createDigit(num1, num2, num3, dig1)
  const generatedCpf = num1.toString() + num2.toString() + num3.toString() + dig1.toString() + dig2.toString()

  const isCpfValid = cpf.isValid(generatedCpf)
  if (isCpfValid) {
    return generatedCpf
  }
  return this.generateCpf()
}

function createDigit (num1, num2, num3, num4) {
  num1 = num1.split('')
  num2 = num2.split('')
  num3 = num3.split('')
  const nums = num1.concat(num2, num3)

  if (num4) {
    nums.push(num4)
  }

  let x = 0
  let j = 0
  for (let i = nums.length + 1; i >= 2; i--) {
    x += parseInt(nums[j++]) * i
  }
  const y = x % 11
  if (y < 2) {
    return 0
  } else {
    return 11 - y
  }
}

function randomNumber () {
  const random = Math.floor(Math.random() * 999)
  if (random < 100) {
    if (random < 10) {
      return '00' + random
    } else {
      return '0' + random
    }
  } else {
    return random
  }
}

async function generateProcess (
  userBuyer,
  userSeller,
  userManager,
  userAgent,
  userAdministrator,
  bank,
  analysis
) {
  const phases = []
  for (let i = 0; i <= 5; i++) {
    const history = await historyFactory.create('History', { phaseIdentificator: i + 1 })
    phases[i] = await phaseFactory.create('Phase', { history: history._id })
  }

  const process = await processFactory.create('Process', {
    phases: [
      phases[0]._id,
      phases[1]._id,
      phases[2]._id,
      phases[3]._id,
      phases[4]._id,
      phases[5]._id
    ],
    bank: bank._id,
    buyer: userBuyer._id,
    currentPhase: phases[0]._id,
    manager: userManager._id,
    agent: userAgent._id,
    seller: userSeller._id,
    responsible: userAdministrator._id,
    fromAnalysis: analysis._id
  })

  return process
}

async function logUser (user, app, request) {
  const loginResponse = await request(app)
    .post('/login')
    .send({
      cpfCnpj: user.CPF,
      password: 'Password@123'
    })

  const token = 'Bearer ' + loginResponse.body.token

  return token
}

module.exports = {
  generateCpf,
  generateProcess,
  logUser
}
