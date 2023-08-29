const express = require("express");
const router = express.Router();
const { authenticated, authenticatedAdmin } = require("../../middleware/auth");

router.get('/private', (req, res) => {
  res.render('chatroom/private')
})

module.exports = router;