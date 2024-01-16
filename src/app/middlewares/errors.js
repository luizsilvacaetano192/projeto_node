class InvalidArgumentError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InvalidArgumentError'
  }
}

class InternalServerError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InternalServerError'
  }
}

class NotFoundError extends Error {
  constructor (entidade) {
    const message = `Não foi possível encontrar ${entidade}`
    super(message)
    this.name = 'NotFoundError'
  }
}

class NotAuthorizedError extends Error {
  constructor () {
    const message = 'Acesso não autorizado'
    super(message)
    this.name = 'NotAuthorizedError'
  }
}

class ForbiddenError extends Error {
  constructor () {
    const message = 'Você não tem permissão para executar esta ação'
    super(message)
    this.name = 'ForbiddenError'
  }
}

class InvalidContentType extends Error {
  constructor (contentType) {
    const message = `O  Content-Type ${contentType} não é aceito`
    super(message)
    this.name = 'InvalidContentType'
  }
}

class BadRequestException extends Error {
  constructor (message) {
    super(message)
    this.name = 'BadRequestException'
  }
}

module.exports = {
  InvalidArgumentError,
  InternalServerError,
  NotFoundError,
  NotAuthorizedError,
  ForbiddenError,
  InvalidContentType,
  BadRequestException
}
