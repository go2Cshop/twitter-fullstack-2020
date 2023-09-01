const { PublicMsg, NotifyMsg, User, PrivateMsg } = require("../models");
const { getEightRandomUsers } = require("../helpers/randomUsersHelper")
const { Op } = require("sequelize");
const moment = require('moment')
const helpers = require("../_helpers");

const fetchChatList = async (req) => {
  const currentUser = helpers.getUser(req);
  const chats = await PrivateMsg.findAll({
    where: {
      [Op.or]: [{ senderId: currentUser.id }, { receiverId: currentUser.id }],
    },
    include: [
      { model: User, as: "sender" },
      { model: User, as: "receiver" },
    ],
    order: [["createdAt", "DESC"]],
    nest: true,
    raw: true,
  });
  const groupedChats = chats.reduce((result, chat) => {
    const key =
      chat.senderId === currentUser.id ? chat.receiverId : chat.senderId;

    if (!result[key]) {
      result[key] = { user: null, chats: [] };
    }

    if (!result[key].user) {
      result[key].user =
        chat.senderId === currentUser.id ? chat.receiver : chat.sender;
    }

    // 直接將最新的一筆 chat 放在 chats 的第一個位置
    if (result[key].chats.length === 0) {
      result[key].chats.push(chat);
    }
    return result;
  }, {});
  const groupedChatsArray = Object.entries(groupedChats).map(
    ([user, chats]) => ({
      user,
      chats,
    })
  );

  return groupedChatsArray;
};

const chatroomController = {
  getPublic: async (req, res) => {
    const allMsg = await PublicMsg.findAll({
      order: [["createdAt", "ASC"]],
      include: [User],
      raw: true,
      nest: true,
    });
    const user = req.user;
    res.render("chatroom/public", { user: user, allMsg: allMsg });
  },
  getNotify: async (req, res) => {
    const user = req.user;
    const recommend = await getEightRandomUsers(req);
    const messages = await NotifyMsg.findAll({
      where: { receiverId: user.id },
      include: [User],
      nest: true,
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    messages.map((msg) => {
      if (msg.titleMsg.includes("開始追蹤你")) msg.isFollowMsg = true;
    });
    await NotifyMsg.update({ isRead: 1 }, { where: { receiverId: user.id } });
    res.render("chatroom/notify", { user, messages, recommend });
  },
  fetchUser: async (req, res) => {
    const user = req.user;
    const userMsgs = await NotifyMsg.findAll({
      where: {
        receiverId: req.user.id,
        isRead: 0,
      },
      raw: true,
    });
    user.notifyMsgCount = userMsgs.length;
    res.send(req.user);
  },
  getPrivateChats: async (req, res, next) => {
    try {
      const groups = await fetchChatList(req);
      res.render("chatroom/private", { groups });
    } catch (err) {
      next(err);
    }
  },
  getChatBox: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id;
      const groups = await fetchChatList(req);
      const selectedId = req.params.id;
      const chats = await PrivateMsg.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { senderId: currentUserId },
                { receiverId: selectedId },
              ],
            },
            {
              [Op.and]: [
                { senderId: selectedId },
                { receiverId: currentUserId },
              ],
            },
          ],
        },
        include: [
          { model: User, as: "sender" },
          { model: User, as: "receiver" },
        ],
        order: [["createdAt", "ASC"]],
        nest: true,
        raw: true,
      });
      const other = await User.findByPk(selectedId, { raw: true });
      res.render("chatroom/private", { groups, other, chats, currentUserId });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = chatroomController