const express = require("express");
const router = express.Router();
const chatroomController = require("../../controllers/chatroom-controller");
const { authenticated, authenticatedAdmin } = require("../../middleware/auth");

router.get('/private', (req, res) => {
  res.render('chatroom/private')
})

router.get('/public', authenticated, chatroomController.getPublic)
router.get('/notify', authenticated, chatroomController.getNotify)

module.exports = router;