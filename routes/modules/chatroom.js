const express = require("express");
const router = express.Router();
const chatController = require('../../controllers/chat-controller')
const { authenticated } = require("../../middleware/auth");

router.get('/private', chatController.getPrivateChats )
router.get('/private/:id', chatController.getChatBox)

module.exports = router;