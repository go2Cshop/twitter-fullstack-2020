if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const handlebarsHelpers = require("./helpers/handlebars-helpers");
const handlebars = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport");
const routes = require("./routes");
const helpers = require("./_helpers");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const port = process.env.PORT || 3000;
const SESSION_SECRET = "secret";

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


// 創建全局變量存儲 io 對象
// global.io = io;

//設置sessionMiddleware
const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
})




app.set("view engine", "hbs");
app.engine("hbs", handlebars({ defaultLayout: 'main', extname: ".hbs", helpers: handlebarsHelpers }));
app.engine("hbs", handlebars({ defaultLayout: 'main', extname: ".hbs", helpers: handlebarsHelpers }));
app.use(express.urlencoded({ extended: true }));

//不用sessionMiddleware會讀不到socket.request.session.passport，不知道為什麼
// app.use(
//   session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
// ); 
app.use(sessionMiddleware)
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
})
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
app.use("/upload", express.static(path.join(__dirname, "upload"))); //上傳圖片
app.use("/", express.static("public"));
app.use((req, res, next) => {
  const { user } = req;
  const {
    success_messages,
    error_messages,
    warning_messages,
    info_messages,
    account_messages,
  } = req.flash();

  res.locals = {
    currentUser: user,
    success_messages,
    error_messages,
    warning_messages,
    info_messages,
    account_messages,
    user: helpers.getUser(req),
    paramsUser: req.params.user,
  };
  res.locals = {
    currentUser: user,
    success_messages,
    error_messages,
    warning_messages,
    info_messages,
    account_messages,
    user: helpers.getUser(req),
    paramsUser: req.params.user,
  };

  // res.locals.currentUser = req.user;
  // res.locals.success_messages = req.flash("success_messages");
  // res.locals.error_messages = req.flash("error_messages");
  // res.locals.warning_messages = req.flash("warning_messages");
  // res.locals.info_messages = req.flash("info_messages");
  // res.locals.account_messages = req.flash("account_messages");
  res.locals.user = helpers.getUser(req);
  res.locals.paramsUser = req.params.user;
  req.io = io
  next();
});

// 引入模組並將 io 對象傳遞給它們


const socket = require("./helpers/socket-helpers")(io);



app.use(routes);
server.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
