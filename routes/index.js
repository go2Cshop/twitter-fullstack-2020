const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const upload = require("../middleware/multer");

const tweetsController = require("../controllers/tweets-controller");
const userController = require("../controllers/user-controller");

const replyController = require("../controllers/reply-controller");
const likesController = require("../controllers/likes-controller");

const { authenticated, authenticatedAdmin } = require("../middleware/auth");
const { generalErrorHandler } = require("../middleware/error-handler");
const admin = require("./modules/admin");

router.use("/admin", admin);

router.get("/signup", userController.signupPage);
router.post("/signup", userController.signup);
router.get("/signin", userController.signinPage);
router.post(
  "/signin",
  passport.authenticate("local", { failureRedirect: "/signin" }),
  userController.sigin
);
router.get("/logout", userController.logout);
router.get("/tweets", authenticated, tweetsController.getTweets);
router.post("/tweets", authenticated, tweetsController.postTweet);
router.get("/tweets/:tweetId", authenticated, tweetsController.getTweet);
router.post(
  "/users/:followingUserId/follow",
  authenticated,
  userController.postFollow
);
router.delete(
  "/users/:followingUserId/follow",
  authenticated,
  userController.deleteFollow
);
router.post("/tweets/:tweetId/like", authenticated, tweetsController.addLike);
router.delete(
  "/tweets/:tweetId/like",
  authenticated,
  tweetsController.deleteLike
);
router.post(
  "/tweets/:tweetId/reply",
  authenticated,
  tweetsController.postReply
);
router.get("/tweets", authenticated, tweetsController.getTweets);
router.post("/tweets", authenticated, tweetsController.postTweet);
router.post("/users/:followingUserId/follow", userController.postFollow);

router.get("/users/:id/tweets", authenticated, userController.getUser);
router.get("/users/:id/replies", authenticated, replyController.getReplies);
router.get("/users/:id/likes", authenticated, likesController.getLikes);
router.get("/users/:id/followers", authenticated, userController.getFollower);
router.get("/users/:id/followings", authenticated, userController.getFollowing);
router.put(
  "/users/:id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  authenticated,
  userController.putUser
);
router.get("/settings", authenticated, userController.getSetting); // 個人資料設定
router.put("/settings", authenticated, userController.putSetting); // 個人資料編輯

router.use("/", (req, res) => res.redirect("/tweets"));
router.use("/", generalErrorHandler);

module.exports = router;
