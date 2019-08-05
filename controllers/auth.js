const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/config.json").PW_SECRET_KEY;
const passport = require("passport");
const db = require("../models");

module.exports = {
  login: {
    post: (req, res, next) => {
      passport.authenticate("login", (err, user, info) => {
        if (err) {
          return res.send("ERROR !! /auth/login : ", {
            success: false,
            message: null,
            error: err
          });
        }

        if (info !== undefined) {
          res.status(201).send({
            success: false,
            message: info.message,
            error: err
          });
        } else {
          req.logIn(user, err => {
            // if (err) {
            //   return res.status(201).send("ERROR ! /auth/login : ", {
            //     success: false,
            //     message: null,
            //     error: err
            //   });
            // }
            // Sequlize DB Serch
            db.users
              .findOne({
                where: {
                  email: user.email
                }
              })
              .then(user => {
                console.log(jwtSecret);
                // Make JWT
                const token = jwt.sign(
                  {
                    email: user.email,
                    nickname: user.nickname,
                    profile_url: user.profile_url
                  },
                  jwtSecret
                );
                res.status(201).send({
                  success: true,
                  message: null,
                  error: err,
                  data: {
                    jwt: token
                  }
                });
              });
          });
        }
      })(req, res, next);
      //   res.send("/auth/login");
    }
  }
};
