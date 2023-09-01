const express = require("express");
const router = express.Router();
const chatroomController = require('../../controllers/chatroom-controller')
const { authenticated } = require("../../middleware/auth");

router.get('/private', chatroomController.getPrivateChats )
router.get('/private/:id', chatroomController.getChatBox)
router.get("/public", authenticated, chatroomController.getPublic);
router.get("/notify", authenticated, chatroomController.getNotify);
router.get('/user', chatroomController.fetchUser)

module.exports = router;