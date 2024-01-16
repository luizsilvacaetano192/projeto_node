const { ForbiddenError } = require('./errors')
const ROLES = require('../helpers/enum/roles.enum')

module.exports = {
  async authorize (
    req,
    res,
    next
  ) {
    try {
      // se o usuário não estiver autenticado, retorna erro
      if (typeof req.authenticated === 'undefined' || req.authenticated === false) {
        return next(new ForbiddenError())
      }

      /* [Refactor] - Nota para o review

        Estou deixando a implementação de um proto-scope neste momento
        que hoje utiliza apenas a flag isMaster para identificar superUsers
        E o userRef para avaliar possibilidade de alterações em registros próprios.

        Já começando com esta estrutura futuramente poderemos
        implementar um permissionamento apropriadamente modularizado
        onde usuários tenham niveis de acesso declarados individualmente por feature.
      */
      req.scope = {
        hasFullPermission: req.user.role === ROLES.ADMINISTRATOR, //&& req.user.isMaster,
        role: req.user.role,
        userRef: req.user._id
      }

      return next()
    } catch (error) {
      return next(error)
    }
  }
}
