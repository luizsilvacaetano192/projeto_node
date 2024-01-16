const Services = require('./Services')
const userModel = require('../models/user')
const notificationModel = require('../models/notification')
const { InternalServerError } = require('../middlewares/errors')

class NotificationService extends Services {
  constructor () {
    super(
      'notifications',
      'Notification'
    )
  }

  async getByUserId (userId) {
    if (typeof userId === 'undefined') {
      throw new InternalServerError("Cannot read property 'isMaster' of null")
    }

    if (userId === '') {
      // eslint-disable-next-line no-useless-escape
      throw new InternalServerError('Cast to ObjectId failed for value \"\" at path \"_id\" for model \"users\"')
    }

    const user = await userModel.findById(userId)

    if (user.isMaster) {
      const notifications = await notificationModel.find({
        opened: false
      })
        .populate('buyer')
        .populate('process')
        .populate('phase')
      return notifications
    }
    const notifications = await notificationModel.find({
      opened: false,
      administrator: userId
    })
      .populate('buyer')
      .populate('process')
      .populate('phase')
    return notifications
  }
}

module.exports = NotificationService
