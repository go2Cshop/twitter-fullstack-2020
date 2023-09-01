const {PrivateMsg} = require('../models')
const moment = require("moment");


module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("join room", (roomName) => {
      socket.join(roomName); 
      console.log(`User joined room: ${roomName}`);
    });
    
    socket.on("private message", async ({room, data}) => {
      PrivateMsg.create({
        text: data.text,
        senderId: data.senderId,
        receiverId: data.receiverId,
      });
      io.emit("private message", data)
    });

    socket.on("notifyMessage", (msg) => {
      console.log("message: " + msg);
      io.emit("notifyMessage", msg);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
