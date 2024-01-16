const model = require('../models')
// const { NotFoundError } = require('../middlewares/errors')

/**
 * A class Services é a classe base de services e provê os métodos comuns a todos os services que a extendem
 */
class Services {
  /**
   * Construtor
   * @params {string} modelName - O nome do model
   * @params {string} itemName - O nome de cada item no banco de dados, no singular
   */
  constructor (modelName, itemName) {
    this.modelName = modelName
    this.itemName = itemName
  }

  /**
   * O método paginate retorna os dados do banco paginados
   * @params {object} [options] - Opções que definem como será o retorno do banco E.g:{ limit: '15', page: '1', sort: { name: -1 } }
   * @params {object} [where={}] - Parametros que definem a cláusula where para filtragem E.g:{ active:true }
   * @return {object} - Objetos de todos os registros filtrados
   */
  async paginate (options, where = {}) {
    return await model[this.modelName].paginate({ active: true, ...where }, options)
  }

  async getById (id) {
    return await model[this.modelName].findById(id)
  }

  async getWithFilter (where) {
    return await model[this.modelName].find({ ...where })
  }

  async create (data) {
    return await model[this.modelName].create({ ...data })
  }

  async update (id, data) {
    return await model[this.modelName].findByIdAndUpdate(id, data, { new: true })
  }

  async delete (id) {
    return await model[this.modelName].findByIdAndUpdate(id, { active: false }, { new: true })
  }

  async findOne (where) {
    return await model[this.modelName].findOne({ ...where })
  }
}

module.exports = Services
