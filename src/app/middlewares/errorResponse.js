const errors = require('./errors')

module.exports = (error, req, res, next) => {
  let status = 500
  const body = {
    error: true,
    message: error.message
  }

  if (error instanceof errors.InvalidArgumentError) {
    status = 400
  }

  if (error instanceof errors.NotFoundError) {
    status = 404
  }

  if (error instanceof errors.NotAuthorizedError) {
    status = 401
  }

  if (error instanceof errors.ForbiddenError) {
    status = 403
  }

  if (error instanceof errors.InvalidContentType) {
    status = 406
  }

  if (['test', 'dev'].indexOf(process.env.NODE_ENV) === -1 && status === 500) {
    body.message = 'Internal Server Error'
  }

  return res.status(status).json(body)
}
