const express = require("express");
const router = express.Router();
const { authenticated, authenticatedAdmin } = require("../../middleware/auth");

router.get('/private', (req, res) => {
  res.render('chatroom/private')
})

router.get('/public', (req, res) => {
  res.render('chatroom/public')
})

module.exports = router;