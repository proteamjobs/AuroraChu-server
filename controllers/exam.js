const db = require("../models");
const passport = require("passport");

const checkStatus = (data, status) => {
  for (item of data) {
    if (item.status === status) {
      return {
        status: item.status,
        testScore: item.test_score,
        testResult: item.test_result
      };
    }
  }
  return null;
};

module.exports = {
  get: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        res.status(200).send("ERROR !! /exam ", {
          success: false,
          message: null,
          error: err
        });
      }
      if (info !== undefined) {
        res.status(200).send({
          success: false,
          message: info.message,
          error: err
        });
      } else {
        db.exam_users
          .findAll({ where: { fk_user_id: user._id } })
          .then(result => {
            res.status(200).json({
              success: true,
              message: "해당 고객의 시험 기록 입니다.",
              error: err,
              firstExamData: checkStatus(result, 1),
              secondExamData: checkStatus(result, 2)
            });
          })
          .catch(err => {
            res.status(200).send({
              success: false,
              message: "GET /exam",
              error: err
            });
          });
      }
    })(req, res, next);
  },
  post: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        res.status(201).send("ERROR !! /exam  ", {
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
        db.exam_users
          .create({
            fk_user_id: user._id,
            status: req.body.status,
            test_score: req.body.testScore,
            test_result: req.body.testResult
          })
          .then(result => {
            res.send(result);
          })
          .catch(err => {
            res.status(201).send({
              success: false,
              message: "POST /exam",
              error: err
            });
          });
      }
    })(req, res, next);
  },
  put: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        res.status(200).send("ERROR !! /exam  ", {
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
        res.send(user);
      }
    })(req, res, next);
    // res.send("PUT /exam");
  },
  test: {
    get: (req, res, next) => {
      res.send("AAAAA!");
    }
  }
};
