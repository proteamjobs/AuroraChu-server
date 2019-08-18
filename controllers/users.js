require("dotenv").config();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.PW_SECRET_KEY;
const BCRIPT_SALT_ROUNDS = 12;

const db = require("../models");
const bcrypt = require("bcrypt");

module.exports = {
  get: (req, res) => {
    res.send("GET /users");
  },
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
  password: {
    put: async (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
          res.status(200).send("ERROR !! /users/password : ", {
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
          let _id = user._id;
          let oldPassword = req.body.oldPassword;
          let newPassword = req.body.newPassword;

          db.users
            .findOne({
              where: {
                _id: user._id
              }
            })
            .then(db_user => {
              bcrypt.compare(oldPassword, db_user.password).then(response => {
                if (response !== true) {
                  res.status(200).json({
                    success: false,
                    message:
                      "ERROR :: /users/password Compare old password in DB",
                    error: "Do not matched old password."
                  });
                } else {
                  bcrypt
                    .hash(newPassword, BCRIPT_SALT_ROUNDS)
                    .then(hashedPassword => {
                      db.users
                        .update(
                          { password: hashedPassword },
                          {
                            where: {
                              _id: user._id
                            }
                          }
                        )
                        .then(() => {
                          res.status(200).json({
                            success: true,
                            message: "Changed Password.",
                            error: null
                          });
                        })
                        .catch(err => {
                          res.status(200).json({
                            success: false,
                            message:
                              "ERROR :: /users/password Bcrypt new passwrod.",
                            error: err
                          });
                        });
                    });
                }
              });
            })
            .catch(err => {
              res.status(200).json({
                success: false,
                message: "ERROR :: /users/password Get user data in DB.",
                error: err
              });
            });

          // res.status(200).json({
          //   success: true,
          //   message: null,
          //   error: err,
          //   _id: _id,
          //   oldPassword: oldPassword
          // });
        }
      })(req, res, next);
      // res.send("PUT /users/password");
    }
  },
  test: {
    get: (req, res) => {
      console.log("/users/test Hello!");
      res.status(200).send("GET /users/test HELLO!!");
    }
  }
};
