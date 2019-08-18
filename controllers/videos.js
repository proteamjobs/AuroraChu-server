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

            res.send({
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
  }
};
