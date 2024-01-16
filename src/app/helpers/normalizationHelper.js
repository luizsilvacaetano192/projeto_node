const crypto = require('crypto')

const normalizeName = (name) => {
  // para melhorar a legibilidade do código.
  const nnDot = '.'
  const nnDotSpace = '. '
  const nnSpace = ' '
  const nnRegexMultipleSpaces = /\s+/g
  const nnRegexRomanNumber = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/

  // Para lidar com nomes abreviados, adicionando espaço após o ponto caso não haja
  name = name.replace(nnDot, nnDotSpace)

  // remove espaços duplicados da string
  name = name.split(nnRegexMultipleSpaces).join(nnSpace)

  // faz as primeiras letras de cada palavra serem maiúsculas
  name = name.toLowerCase()
  name = name.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
    function (s) {
      return s.toUpperCase()
    })

  // cria um array separando o nome nos espaços para analizar cada parte individualmente depois
  const nameParts = name.split(nnSpace)

  // exceções para a regra de capitalização
  const exceptions = [
    'de', 'di', 'do', 'da', 'dos', 'das', 'dello', 'della',
    'dalla', 'dal', 'del', 'e', 'em', 'na', 'no', 'nas', 'nos', 'van', 'von',
    'y', 'of'
  ]

  // percorrendo o nome
  for (let i = 0; i < nameParts.length; ++i) {
    // corrige as exceções no nome
    exceptions.forEach((exception) => {
      if (nameParts[i].toLowerCase() === exception.toLowerCase()) {
        nameParts[i] = exception
      }
    })

    // Situação rara, mas possível de números romanos no nome (comum em nomes de rua como Pio XII)
    if (nameParts[i].toUpperCase().match(nnRegexRomanNumber)) {
      nameParts[i] = nameParts[i].toUpperCase()
    }
  }

  // retorna o nome tratado
  return nameParts.join(nnSpace)
}

const normalizePhone = (phone) => {
  return phone.replace(/\D/g, '')
}

const camelize = (str) => {
  str = str.toLowerCase()
  str = str.replace(/_/g, ' ')
  str = str.replace(/-/g, ' ')
  return str.replace(/\W+(.)/g, function (match, chr) {
    return chr.toUpperCase()
  })
}

// este método transforma uma string contendo um regex em um regex de fato
const normalizeRegex = async (regexString) => {
  regexString = regexString.split('/')
  const modificator = regexString.pop()
  // remove o primeiro item, que sempre é vazio, pois o regex começa com /
  regexString.shift()
  // monta o regex novamente
  regexString = regexString.join('/')
  // devolve um regex de fato ao invés de uma string
  return RegExp(regexString, modificator)
}

const randomHexString = size => {
  if (size === 0) {
    throw new Error('Zero-length randomHexString is useless.')
  }

  if (size % 2 !== 0) {
    throw new Error('randomHexString size must be divisible by 2.')
  }

  return (0, crypto.randomBytes)(size / 2).toString('hex')
}

module.exports = {
  normalizeName,
  normalizePhone,
  camelize,
  normalizeRegex,
  randomHexString
}
