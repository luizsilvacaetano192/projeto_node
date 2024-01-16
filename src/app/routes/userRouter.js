const { Router } = require('express')
const auth = require('../middlewares/auth')
const Authorization = require('../middlewares/authorization')
const UserController = require('../controllers/UserController')
const UserAddValidation = require('../validations/userAddValidation')
const UserSelfAddValidation = require('../validations/userSelfAddValidation')
const UserUpdateValidation = require('../validations/userUpdateValidation')
const ChangePasswordValidation = require('../validations/changePasswordValidation')
const ChangePasswordWithTokenValidation = require('../validations/changePasswordWithTokenValidation')
const QueryStringTreatment = require('../middlewares/queryStringTreatment')

const router = Router()

router.route('/user')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
      QueryStringTreatment.treatQueryString(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para filtrar usuários por nome e role'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/UserList" } }
      return UserController.getWithFilter(req, res, next)
    }
  ])

router.route('/user/:role')
  .post([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    UserAddValidation.validationRules(),
    (req, res, next) => {
      UserAddValidation.validate(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['User']
      // #swagger.description = 'Endpoint para cadastrar um usuário'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddUser" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/UserItem" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }

      return UserController.create(req, res, next)
    }
  ])

router.route('/user')
  .post([
    UserSelfAddValidation.validationRules(),
    (req, res, next) => {
      UserSelfAddValidation.validate(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['User']
      // #swagger.description = 'Endpoint que permite usuarios se cadastrarem através do app'
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/SelfAddUser" } }
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/UserItem" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/ValidationErrors" } }

      return UserController.selfCreate(req, res, next)
    }
  ])

router.route('/user/:id')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['User']
      // #swagger.description = 'Endpoint para retornar um usuário por id'
      // #swagger.security = [{"jwt": []}]
      // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/UserItem" } }
      return UserController.get(req, res, next)
    }
  ])
  .put([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    UserUpdateValidation.validationRules(),
    (req, res, next) => {
      UserUpdateValidation.validate(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para editar um usuário'
    // #swagger.security = [{"jwt": []}]
    // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/AddUser" } } */
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/UserItem" } }
      return UserController.update(req, res, next)
    }
  ])
  .delete([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para deletar um usuário'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/UserItem" } }
      return UserController.delete(req, res, next)
    }
  ])

// This endpoint accepts query parameters, we need to include it in swagger
router.route('/user-table')
  .get([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    (req, res, next) => {
      QueryStringTreatment.treatQueryString(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para retornar todos os dados de Usuários paginados'
    // #swagger.security = [{"jwt": []}]
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/UserTableList" } }
      return UserController.getAll(req, res, next)
    }
  ])

router.route('/login')
  .post([
  
    auth.local,
    (req, res, next) => {
      // #swagger.tags = ['Login']
      // #swagger.description = 'Endpoint para fazer login de usuário ou imobiliaria'
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/Login" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/LoginResponse" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { "error": true, "message": "Acesso não autorizado" } }
   
      return UserController.login(req, res, next)
    }
  ])

/*
  [Refactor]
  Endpoint de Refresh não existia na legada, resolvi colocar.
*/
router.route('/login/refresh')
  .post([
    auth.refresh,
    (req, res, next) => {
      // #swagger.tags = ['Usuario']
      // #swagger.description = 'Endpoint para fazer refresh do token'
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/Refresh" } }
      // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/RefreshResponse" } }
      // #swagger.responses[401] = { description: 'Resposta de erro', schema: { $ref: "#/definitions/NotAuthorizedError" } }
      return UserController.login(req, res, next)
    }
  ])

/*
  [Refactor]
  Endpoint de Logout não existia na legada, resolvi colocar.
*/
router.route('/logout')
  .post([
    auth.refresh,
    auth.bearer,
    (req, res, next) => {
      // #swagger.tags = ['Login']
      // #swagger.description = 'Endpoint para fazer logout de um usuário ou imobiliaria'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { refreshToken: "dc48f4a9353cf65ccc5425d915696a9059cbba6005e63608" } }
      // #swagger.responses[204] = { description: 'Resposta de sucesso' }
      // #swagger.responses[401] = { description: 'Resposta de erro', schema: { $ref: "#/definitions/NotAuthorizedError" } }
      return UserController.logout(req, res, next)
    }
  ])

/*
  [Refactor]
  Me parece que é um endpoint para renovar o token quando estiver para vencer.
  Imagino que no front-end se esteja calculando o tempo para fazer chamadas pra cá.
*/
router.route('/login/token')
  .post([
    (req, res, next) => {
      // #swagger.tags = ['Login']
      // #swagger.description = 'Endpoint para relogar um usuário ou imobiliaria a partir de um token ainda válido (não expirado)'
      // #swagger.security = [{"jwt": []}]
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/LoginRelog" } } */
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/LoginResponse" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { "error": true, "message": "Acesso não autorizado" } }

      return UserController.login(req, res, next)
    }
  ])

router.route('/login/recovery-solicitation')
  .post([
    (req, res, next) => {
      // #swagger.tags = ['Login']
      // #swagger.description = 'Endpoint para enviar token para redefinição de senha'
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/recoverySolicitation" } }
      // #swagger.responses[204] = { description: 'Resposta de sucesso', schema: { message: '' } }
      // #swagger.responses[404] = { description: 'Resposta de erro', schema: { message: 'Não foi possível encontrar Usuário' } }
      return UserController.forgotPassword(req, res, next)
    }
  ])

/*
  [Refactor] - Nota para conferir no review se esta decisão é OK:

    Esse endpoint teve btt alteração de funcionamento interno.
    Removeu-se o uso de uma tabela intermediária de recovery
    e passou a se usar um token com 1h de vida.

    Mas o mais relevante é que antes eram recebidos 3 parametros:
    - cpfCnpj
    - code
    - password

    E hoje excluiu-se o uso do "cpfCnpj" pois o usuário já vem pelo token (code)

    Não vai quebrar nada se enviarem... só não vai ter uso
*/
router.route('/login/recovery')
  .post([
    ChangePasswordWithTokenValidation.validationRules(),
    (req, res, next) => {
      ChangePasswordWithTokenValidation.validate(req, res, next)
    },
    (req, res, next) => {
      // #swagger.tags = ['Login']
      // #swagger.description = 'Endpoint para realizar mudança de password com token temporário que usuario recebeu por email'
      // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/ChangePasswordWithToken" } }
      // #swagger.responses[204] = { description: 'Resposta de sucesso', schema: { message: 'Senha alterada' } }
      // #swagger.responses[400] = { description: 'Resposta de erro', schema: { message: 'Não foi possível alterar a senha' } }

      return UserController.changePasswordWithToken(req, res, next)
    }
  ])

/*
  [Refactor] - Nota para conferir no review se esta decisão é OK:

  Na API legada havia uma falha de segurança nesse endpoint
  que permitia que qualquer usuário alterasse a senha de qualquer outro usuario.

  A implementação aqui foi feita de forma a implementar a regra
  de que apenas superUsers (isMaster = true)
  ou o próprio dono do registro a ser alterado possam alterar a senha

  Ah. E o campo "isRealEstate" que a legada usava
  para dizer se o elemento a ser modificado é do tipo Real Estate eu decidi ignorar e fazer a checagem

  Se enviar não quebra nada mas tb não define nada.
*/
router.route('/login/new-password')
  .post([
    auth.bearer,
    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },
    ChangePasswordValidation.validationRules(),
    (req, res, next) => {
      ChangePasswordValidation.validate(req, res, next)
    },
    (req, res, next) => {
    // #swagger.tags = ['Login']
    // #swagger.description = 'Endpoint para alterar senha de usuário ou imobiliaria'
    // #swagger.security = [{"jwt": []}]
    // #swagger.parameters['request'] = { in: 'body', required: 'true', type: 'object', schema: { $ref: "#/definitions/ChangePassword" } }
    // #swagger.responses[200] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/UserItem" } }
    // #swagger.responses[404] = { description: 'Resposta de erro', schema: { "error": true, "message": "Acesso não autorizado" } }

      return UserController.changePassword(req, res, next)
    }
  ])

router.route('/push-notification/token')
  .put([
    auth.bearer,

    (req, res, next) => {
      Authorization.authorize(req, res, next)
    },

    (req, res, next) => {
      // #swagger.tags = ['Notification']
      // #swagger.description = 'Endpoint para gravar o token do notification no usuario'
      // #swagger.security = [{"jwt": []}]
      // #swagger.responses[201] = { description: 'Resposta de sucesso', schema: { $ref: "#/definitions/NotificationItem" } }
      // #swagger.responses[500] = { description: 'Erro de validação', schema: { $ref: "#/definitions/LegacyValidationErrors" } }
      return UserController.changeNotificationToken(req, res, next)
    }
  ])

module.exports = router
