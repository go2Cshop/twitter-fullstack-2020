const {User, PrivateMsg} = require('../models')

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    // receive message
    socket.on("chat message", (msg) => {
      console.log("message: " + msg);
      
      io.emit('allMessage', msg)
    });


    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  })
}