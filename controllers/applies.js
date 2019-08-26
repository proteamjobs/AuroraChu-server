const passport = require("passport");
const db = require("../models");

module.exports = {
  get: (req, res, next) => {
    res.send("/applies");
  },
  delete: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        res.status(201).json("ERROR !! Delete /appies", {
          success: false,
          message: null,
          error: err
        });
      }
      if (info !== undefined) {
        res.status(201).json({
          success: false,
          message: info.message,
          error: err
        });
      } else {
        db.marketer_applies
          .destroy({ where: { user_id: user._id } })
          .then(data => {
            if (!data) {
              res.status(201).json({
                success: false,
                message: "삭제할 내역이 없습니다.",
                error: null
              });
            } else {
              res.status(201).json({
                success: true,
                message: "성공적으로 삭제되었습니다.",
                error: null
              });
            }
          });
      }
    })(req, res, next);
  },
  status: {
    get: (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
          res.status(200).json("ERROR !! /appies/status", {
            success: false,
            message: null,
            error: err
          });
        }
        if (info !== undefined) {
          res.status(200).json({
            success: false,
            message: info.message,
            error: err
          });
        } else {
          db.marketer_applies
            .findOne({
              where: {
                user_id: user._id
              }
            })
            .then(data => {
              if (!data) {
                res.status(200).json({
                  success: true,
                  message: "신청 내역이 없습니다.",
                  error: err,
                  status: -1
                });
              } else if (data.status === "0") {
                res.status(200).json({
                  success: true,
                  message: "아직 처리중 입니다.",
                  error: err,
                  status: data.status
                });
              } else if (data.status === "1") {
                res.status(200).json({
                  success: true,
                  message: "신청이 보류되었습니다. 다시 신청해주세요.",
                  error: err,
                  status: data.status
                });
              } else if (data.status === "2") {
                res.status(200).json({
                  success: true,
                  message: "승인이 완료되었습니다.",
                  error: err,
                  status: data.status
                });
              } else {
                res.status(200).json({
                  success: false,
                  message: "ERROR :: status",
                  error: null
                });
              }
            })
            .catch(err => {
              console.log("ERROR :: /applies/status");
              res.status(200).send(err);
            });
        }
      })(req, res, next);
    }
  }
};
