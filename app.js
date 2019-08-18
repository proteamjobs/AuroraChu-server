var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
const cors = require("cors");
let indexRouter = require("./routes/index");
let authRouter = require("./routes/auth");
let usersRouter = require("./routes/users");
let marketersRouter = require("./routes/marketers");
let videosRouter = require("./routes/videos");

let db = require("./models/index.js");
db.sequelize
  // .sync()
  .sync({ alter: true })
  // .sync({ force: true })
  .then(() => {
    console.log(" DB Connect!");
  })
  .catch(err => {
    console.log(" DB Not Connect!");
    console.log(err);
  });

var app = express();
require("./modules/passport");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/marketers", marketersRouter);
app.use("/videos", videosRouter);

module.exports = app;
