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
  },
  me: {
    get: (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
          res.status(200).send("ERROR !! /auth/me : ", {
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
          res.status(200).json({
            success: true,
            message: null,
            error: err,
            user
          });
        }
      })(req, res, next);
    }
  },
  verify: {
    get: async (req, res, next) => {
      if (req.query.email !== undefined) {
        await db.users
          .findAndCountAll({
            where: {
              email: req.query.email
            }
          })
          .then(user => {
            if (!user.count) {
              res.status(200).json({
                success: true,
                message: "OK",
                err: null
              });
            } else {
              res.status(200).json({
                success: false,
                message: "Already user.",
                err: null
              });
            }
          });
      } else {
        res.status(200).json({
          success: true,
          message: null,
          err: "Usage is wrong API."
        });
      }
    }
  }
};
