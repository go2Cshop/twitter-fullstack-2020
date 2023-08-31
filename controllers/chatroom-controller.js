const { PublicMsg, User} = require('../models')
const moment = require('moment')

const chatroomController = {
  getPublic: async (req, res) => {
    const allMsg = await PublicMsg.findAll({
      order: [['createdAt', 'ASC']],
      include: [
        User
      ],
      raw: true,
      nest: true,
    })
    const user = req.user
    res.render('chatroom/public', { user: user, allMsg: allMsg })
  }
}

module.exports = chatroomController