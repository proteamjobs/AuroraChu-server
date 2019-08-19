const passport = require("passport");
const db = require("../models");

module.exports = {
  get: (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err) {
          res.status(200).send("ERROR !! /videos : ", {
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
          let countVideo = await db.videos.findAndCountAll();
          db.videos.findAll().then(async video => {
            let videosMap = video.map(async data => {
              let checkComplete = await db.videos_processes.findAndCountAll({
                where: { user_id: user._id, video_id: data._id }
              });
              if (checkComplete.count) {
                return {
                  video_id: data._id,
                  title: data.title,
                  description: data.description,
                  next: data.next,
                  isComplete: true
                };
              } else {
                return {
                  video_id: data._id,
                  title: data.title,
                  description: data.description,
                  next: data.next,
                  isComplete: false
                };
              }
            });

            let countCompleteVideo = await db.videos_processes.findAndCountAll({
              where: { user_id: user._id }
            });

            let videos = await Promise.all(videosMap);

            res.status(200).send({
              success: true,
              message: null,
              error: err,
              videos,
              process: {
                percentage: Math.round(
                  (countCompleteVideo.count / countVideo.count) * 100
                ),
                completed_video: countCompleteVideo.count,
                total_video: countVideo.count
              }
            });
          });
        }
      }
    )(req, res, next);
  },
  complete: {
    post: (req, res, next) => {
      passport.authenticate(
        "jwt",
        { session: false },
        async (err, user, info) => {
          if (err) {
            res.status(200).send("ERROR !! /videos/:video_id/complete : ", {
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
            if (!Object.keys(req.params).length) {
              res.status(201).send({
                success: false,
                message: "잘못된 요청입니다.",
                error: null
              });
            } else if (typeof parseInt(req.params.video_id) !== "number") {
              console.log(
                req.params.video_id,
                typeof parseInt(req.params.video_id)
              );
              res.status(201).send({
                success: false,
                message: "잘못된 요청입니다.",
                error: null
              });
            } else {
              db.videos_processes
                .findAndCountAll({
                  where: { user_id: user._id, video_id: req.params.video_id }
                })
                .then(data => {
                  if (data.count) {
                    res.status(201).send({
                      success: false,
                      message: "이미 존재하는 데이터 입니다.",
                      error: null
                    });
                  } else {
                    db.videos_processes
                      .create({
                        user_id: user._id,
                        video_id: req.params.video_id
                      })
                      .then(() => {
                        res.status(201).send({
                          success: true,
                          message: null,
                          error: null
                        });
                      });
                  }
                });
            }
          }
        }
      )(req, res, next);
    }
  }
};
