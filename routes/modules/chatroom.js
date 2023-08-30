const express = require("express");
const router = express.Router();
const { authenticated, authenticatedAdmin } = require("../../middleware/auth");
const chatroomController = require("../../controllers/chatroom-controller");

router.get('/private', (req, res) => {
  res.render('chatroom/private')
})

router.get('/public', chatroomController.getPublic)

module.exports = router;