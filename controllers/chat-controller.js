const { sequelize, PrivateMsg, User } = require("../models");
const { Op } = require("sequelize");
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

const chatController = {
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
        order: [["createdAt", "DESC"]],
        nest: true,
        raw: true,
      });
      const other = await User.findByPk(selectedId, { raw: true });
      console.log(other)
      res.render("chatroom/private", { groups, other, chats, currentUserId });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = chatController;
