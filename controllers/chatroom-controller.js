const { PublicMsg, NotifyMsg, User } = require('../models')
const { getEightRandomUsers } = require("../helpers/randomUsersHelper")
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
  },
  getNotify: async (req, res) => {
    const user = req.user
    const recommend = await getEightRandomUsers(req)
    const messages = await NotifyMsg.findAll({
      where: { receiverId: user.id },
      include: [User],
      nest: true,
      raw: true,
      order: [['createdAt', 'DESC']]
    })
    messages.map(msg => {
      if (msg.titleMsg.includes('開始追蹤你')) msg.isFollowMsg = true
    })
    res.render('chatroom/notify', { user, messages, recommend })
  }
}

module.exports = chatroomController