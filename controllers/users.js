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
  withdrawal: {
    put: (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
          res.status(200).send("ERROR !! DELETE /users/withdrawal : ", {
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
          db.users
            .update(
              { is_current_member: 0 },
              {
                where: {
                  _id: user._id
                }
              }
            )
            .then(() => {
              res.status(201).send({
                success: true,
                message: "",
                error: err
              });
            })
            .catch(err => {
              res.status(201).send({
                success: false,
                message: "ERROR",
                error: err
              });
            });
        }
      })(req, res, next);
    }
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
                            message: "성공적으로 비밀번호가 변경되었습니다.",
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
        }
      })(req, res, next);
      // res.send("PUT /users/password");
    }
  },
  verify: {
    get: (req, res, next) => {
      if (!req.query.nickname) {
        res.status(200).json({
          success: false,
          message: "잘못된 요청입니다. 쿼리를 확인하세요.",
          error: null
        });
      } else {
        console.log(req.query.nickname);
        db.users
          .findAndCountAll({
            where: {
              nickname: req.query.nickname
            }
          })
          .then(data => {
            if (data.count) {
              res.status(200).json({
                success: false,
                message: "이미 사용중인 닉네임입니다.",
                error: null
              });
            } else if (!data.count) {
              res.status(200).json({
                success: true,
                message: "사용할 수 있는 닉네임입니다.",
                error: null
              });
            }
          })
          .catch(err => {
            console.log("ERROR /users/verify");
            res.status(200).send(err);
          });
      }
    }
  },
  nickname: {
    put: (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
          res.status(200).send("ERROR !! /users/nickname : ", {
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
          if (!req.body.newNickName) {
            res.status(201).json({
              success: false,
              message: "잘못된 요청입니다. 바디를 확인하세요.",
              error: err
            });
          } else {
            db.users
              .update(
                { nickname: req.body.newNickName },
                {
                  where: {
                    nickname: user.nickname
                  }
                }
              )
              .then(() => {
                res.status(201).json({
                  success: true,
                  message: "성공적으로 닉네임을 변경하였습니다.",
                  error: err
                });
              })
              .catch(err => {
                res.status(201).json({
                  success: false,
                  message: "ERROR /users/nickname",
                  error: err
                });
              });
          }
        }
      })(req, res, next);
    }
  },
  test: {
    get: (req, res) => {
      console.log("/users/test Hello!");
      res.status(200).send("GET /users/test HELLO!!");
    }
  }
};
