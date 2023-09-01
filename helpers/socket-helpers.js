const { PrivateMsg, PublicMsg, User } = require("../models");
const moment = require("moment");

let onlineUsers = [];
let onlineCounts = 0;
let onlineUserPop = "";

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("login", async () => {
      console.log(socket.request.session.passport); //{ user: id }
      const sessionUserId = socket.request.session.passport.user;
      const userFilter = onlineUsers.find((item) => item.id === sessionUserId);
      if (!userFilter) {
        let user = await User.findByPk(sessionUserId);
        user = user.toJSON();
        onlineUsers.push({
          id: user.id,
          name: user.name,
          account: user.account,
          avatar: user.avatar,
        });
        onlineCounts = onlineUsers.length;
        onlineUserPop = user.name;
      }
      io.emit("onlineUsers", onlineUsers);
      io.emit("onlineCounts", onlineCounts);
      io.emit("onlineUserPop", onlineUserPop);
    });

    socket.on("chat message", async (data) => {
      await PublicMsg.create({
        UserId: data.id,
        content: data.msg,
      });
      data["time"] = moment().fromNow();
      //要對所有 Client 廣播的事件名稱 chat message
      io.emit("chat message", data);
    });

    socket.on("join room", (roomName) => {
      socket.join(roomName);
      console.log(`User joined room: ${roomName}`);
    });

    socket.on("private message", async ({ room, data }) => {
      PrivateMsg.create({
        text: data.text,
        senderId: data.senderId,
        receiverId: data.receiverId,
      });
      io.emit("private message", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      console.log("user disconnected");
      const sessionUserId = socket.request.session.passport
        ? socket.request.session.passport.user
        : null;
      onlineUsers = onlineUsers.filter((item) => item.id !== sessionUserId);
      onlineCounts = onlineUsers.length;
      //要對所有 Client 廣播的事件名稱 onlineCount onlineUsers outlineUserPop
      io.emit("onlineCounts", onlineCounts);
      io.emit("onlineUsers", onlineUsers);
      io.emit("outlineUserPop", onlineUserPop);
    });
  });
};
