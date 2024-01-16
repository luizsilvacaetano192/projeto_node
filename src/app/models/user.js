const mongoosePaginate = require('mongoose-paginate-v2')
const USER_ROLES = require('../helpers/enum/roles.enum')

const bcrypt = require('bcrypt')

const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose')

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    CPF: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    phone: { type: String },
    birthDate: { type: Date },
    role: { type: String, enum: Object.values(USER_ROLES) },
    creci: { type: String },
    active: { type: Boolean, default: true },
    isMaster: { type: Boolean, default: false },
    realEstate: { type: ObjectId, ref: 'realEstate' },
    resetPassword: { type: Boolean, default: false },
    notificationToken: { type: String }
  },
  { timestamps: true }
)
UserSchema.plugin(mongoosePaginate)

// Remove sensible or useless data from user read
UserSchema.set('toJSON', {
  transform: (doc, { __v, password, resetPassword, ...rest }, options) => rest
})

// Middleware/Hook to hash the password when saving new register
UserSchema.pre('save', async function save (next) {
  if (!this.isModified('password')) return next()
  try {
    this.password = await this.getHash(this.password)
    return next()
  } catch (err) {
    return next(err)
  }
})

/*
  O Middleware/Hook 'pre' de findOneAndUpdate não tem o mesmo acesso direto ao 'this' como o de save
  E Como não temos acesso a averiguação de "this.isModified('password')"
  Devemos buscar o dado antigo através de uma query e coletar os dados do novo de seu 'this'
*/
UserSchema.pre('findOneAndUpdate', async function (next) {
  const newPasword = this._update.password
  // Confere se há a tentativa de alterar o password neste update
  if (typeof newPasword !== 'undefined') {
    const docToUpdate = await this.model.findOne(this.getQuery())
    const oldPassowrd = docToUpdate.password

    // confere se o password passado difere do antigo
    const checkPassword = await bcrypt.compare(newPasword, oldPassowrd)
    if (checkPassword) {
      /*
      O password não está sendo alterado
      portanto, removemos o campo da query de update
      para que não seja realizada uma alteração desnecessaria de hash
      */
      delete this._update.password
      return next()
    }

    // Caso chegue aqui, o password antigo está sendo alterado.
    // E o novo password precisa ser hasheado
    try {
      this._update.password = await bcrypt.hash(newPasword, parseInt(process.env.HASH_COST))
      return next()
    } catch (err) {
      return next(err)
    }
  }
})

UserSchema.methods.getHash = async function (password) {
  return await bcrypt.hash(password, parseInt(process.env.HASH_COST))
}

UserSchema.methods.checkPassword = async function checkPassword (data) {
  return bcrypt.compare(data, this.password)
}

module.exports = model('users', UserSchema)
