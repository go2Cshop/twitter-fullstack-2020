const { getEightRandomUsers } = require("../helpers/randomUsersHelper");
const { Tweet, User, Reply, Like } = require("../models");
const helpers = require("../_helpers");

const tweetsController = {
  getTweets: async (req, res, next) => {
    try {
      const recommend = await getEightRandomUsers(req);
      const currentUserId = helpers.getUser(req).id;
      const currentUser = helpers.getUser(req);
      const tweets = await Tweet.findAll({
        include: [User, Reply, Like],
        order: [["updatedAt", "DESC"]],
      });

      const showTweets = tweets.map((tweet) => {
        const replies = tweet.Replies.length;
        const likes = tweet.Likes.length;
        const isLiked = tweet.Likes.some((l) => l.UserId === currentUserId);
        const userAvatar = tweet.User.avatar;
        return {
          tweetId: tweet.id,
          userId: tweet.User.id,
          userAccount: tweet.User.account,
          userName: tweet.User.name,
          userAvatar: tweet.User.avatar,
          text: tweet.description,
          createdAt: tweet.createdAt,
          replies,
          likes,
          isLiked,
          userAvatar,
          currentUser,
        };
      });
      return res.render("tweets", {
        tweets: showTweets,
        recommend,
        currentUser,
      })


    } catch (err) {
      next(err);
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body;
      const currentUserId = helpers.getUser(req).id;
      if (!description) throw new Error("內容不可為空白");
      if (description.length > 140) throw new Error("內容不可超過140字");
      await Tweet.create({
        UserId: currentUserId,
        description,
      });

      const tweet = await Tweet.findOne({
        where: {
          UserId: currentUserId,
        },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      const user = await User.findOne({
        where: { id: currentUserId },
        include: [{ model: User, as: 'Subscribers' }]
      })
      user.toJSON()
      const userName = user.name
      const avatar = user.avatar

      user.Subscribers.map(user => {
        const notifyTo = `notify_to_${user.id}`
        const notifyData = {
          messageTitle: `${userName} 有新的推文通知`,
          messageContent: `${description}`,
          avatar: `${avatar}`,
          tweetId: `${tweet.id}`,
          senderId: currentUserId
        }
        req.io.emit(notifyTo, notifyData)
      })

      req.flash("success_messages", "推文成功！");
      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const recommend = await getEightRandomUsers(req);
      const currentUserId = helpers.getUser(req).id;
      const currentUser = helpers.getUser(req);
      const { id } = req.params;
      const tweet = await Tweet.findByPk(id, {
        nest: true,
        include: [User, { model: Reply, include: User }, Like],
      });
      if (!tweet) throw new Error('推文不存在!')
      const repliesAmount = tweet.Replies.length;
      const likesAmount = tweet.Likes.length;
      const isLiked = tweet.Likes.some((l) => l.UserId === currentUserId);

      return res.render("tweet", {
        tweet: tweet.toJSON(),
        repliesAmount,
        likesAmount,
        recommend,
        isLiked,
        currentUser,
      });
    } catch (err) {
      next(err);
    }
  },
  addLike: async (req, res, next) => {
    try {
      const { id } = req.params;
      const currentUserId = helpers.getUser(req).id;
      const likes = await Like.findOne({
        where: { userId: currentUserId, TweetId: id },
      });
      if (likes) throw new Error("You already liked this tweet!");
      await Like.create({
        UserId: currentUserId,
        TweetId: id,
      });
      const tweet = await Tweet.findOne({
        where: { id },
        include: [{ model: User }]
      })
      // 將訊息通知被追蹤者
      const notifyTo = `notify_to_${tweet.User.id}`
      const notifyData = {
        messageTitle: `${helpers.getUser(req).name} 喜歡你的貼文`,
        messageContent: ``,
        avatar: `${helpers.getUser(req).avatar}`,
        tweetId: ``,
        senderId: currentUserId
      }
      req.io.emit(notifyTo, notifyData)

      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
  postUnlike: async (req, res, next) => {
    try {
      const { id } = req.params;
      const currentUserId = helpers.getUser(req).id;
      const likes = await Like.findOne({
        where: { userId: currentUserId, TweetId: id },
      });
      if (!likes) throw new Error("You already unlike it!");
      await likes.destroy();
      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
  postReply: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id;
      const { comment } = req.body;
      if (!comment) throw new Error("Content is required!");
      if (comment.length > 140) return;
      await Reply.create({
        UserId: currentUserId,
        TweetId: req.params.id,
        comment,
      })

      const reply = await Reply.findOne({
        where: {
          TweetId: req.params.id,
          UserId: currentUserId
        },
        order: [['createdAt', 'DESC']],
        include: [
          Tweet,
          {
            model: Tweet,
            raw: true,
            include: User
          }
        ],
        nest: true,
        raw: true
      })
      const tweetUser = reply.Tweet.User

      const senderUser = await User.findOne({
        where: { id: currentUserId },
        include: [{ model: User, as: 'Subscribers' }]
      })

      senderUser.Subscribers.map(user => {
        const notifyTo = `notify_to_${user.id}`
        const notifyData = {
          messageTitle: `${senderUser.name} 有新的回覆`,
          messageContent: reply.comment,
          avatar: senderUser.avatar,
          tweetId: req.params.id,
          senderId: senderUser.id
        }

        req.io.emit(notifyTo, notifyData)
      })

      const notifyTo = `notify_to_${tweetUser.id}`
      const notifyData = {
        messageTitle: `你的貼文有新的回覆`,
        messageContent: reply.comment,
        avatar: senderUser.avatar,
        tweetId: req.params.id,
        senderId: senderUser.id
      }
      req.io.emit(notifyTo, notifyData)

      req.flash("success_messages", "留言成功！");
      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
};

module.exports = tweetsController;
