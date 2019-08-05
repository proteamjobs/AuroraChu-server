require("dotenv").config();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.PW_SECRET_KEY;
const db = require("../models");

module.exports = {
  post: (req, res, next) => {
    // res.send(`${req.params}, ${req.query}, ${jwtSecret}`);
    passport.authenticate("register", (err, user, info) => {
      if (err) {
        res.status(201).send("ERROR /users/signin : ", err);
      }

      if (info !== undefined) {
        res.status(201).send({
          success: false,
          message: info.message
        });
      } else {
        req.logIn(user, err => {
          res.status(201).send({
            success: true
          });
        });
      }
    })(req, res, next);

    // res.status(200).send("POST /users/:user_id");
  },
  test: {
    get: (req, res) => {
      console.log("/users/test Hello!");
      res.status(200).send("GET /users/test HELLO!!");
    }
  }
};
