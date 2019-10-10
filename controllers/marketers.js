const passport = require("passport");
const db = require("../models");
const path = require("path");

const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");

let s3 = new AWS.S3();

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "wake-up-file-server/post_img",
    key: function(req, file, cb) {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: "public-read-write"
  })
});

module.exports = {
  get: (req, res) => {
    let categoryFilter = {};
    if (req.query.category) {
      categoryFilter["category"] = req.query.category;
    }
    let pageNum;
    req.query.page ? (pageNum = req.query.page) : (pageNum = 1);

    let offset = 0;
    let limit = 12;
    if (pageNum > 1) {
      offset = limit * (pageNum - 1);
    }

    db.marketer_posts
      .findAndCountAll({
        where: categoryFilter,
        offset: offset,
        limit: limit,
        include: [{ model: db.users }, { model: db.reviews }]
      })
      .then(result => {
        res.status(200).json({
          success: true,
          message: "",
          error: null,
          maxPage: Math.ceil(result.count / limit),
          totalPage: result.count,
          marketers: result.rows.map(data => {
            let avgStar = 0;
            let review_count = data.reviews.length;
            if (review_count) {
              let sumStar = 0;
              data.reviews.forEach(review => {
                sumStar += review.star;
              });
              avgStar = Math.round((sumStar / review_count) * 2) / 2;
            }
            return {
              marketer_info: {
                user_id: data.user._id,
                nickname: data.user.nickname,
                number_of_sales: 0,
                avg_star: avgStar,
                review_count: review_count
              },
              post: {
                post_id: data._id,
                title: data.title,
                image_url: data.image_url
              }
            };
          })
        });
      })
      .catch(err => {
        res.status(200).json({
          success: false,
          message: "",
          error: err
        });
      });

    // if (!Object.keys(req.query).length) {
    //   res.send("/marketers");
    // } else if (req.query.category) {
    //   res.send("/marketers?category=" + req.query.category);
    // } else {
    //   res.send("ERROR :: /marketers :: Query String or Path URL.");
    // }
  },
  post: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        res.status(200).send("ERROR !! POST /marketer : ", {
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
        db.marketer_posts
          .findAndCountAll({
            where: { fk_user_id: user._id }
          })
          .then(post => {
            if (post.count > 0) {
              res.status(201).send({
                success: false,
                message: "이미 등록되어 있는 마케터 입니다.",
                error: null
              });
            } else {
              db.marketer_posts
                .create({
                  fk_user_id: user._id,
                  title: req.body.title,
                  content: req.body.content,
                  image_url: req.body.image_url,
                  avg_duration: req.body.avg_duration,
                  category: req.body.category
                })
                .then(() => {
                  res.status(201).json({
                    success: true,
                    message: "마케터가 성공적으로 등록되었습니다.",
                    error: err
                  });
                })
                .catch(err => {
                  res.status(201).json({
                    success: false,
                    message: "",
                    error: err
                  });
                });
            }
          });
      }
    })(req, res, next);
  },
  delete: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        res.status(200).send("ERROR !! POST /marketer : ", {
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
        db.marketer_posts
          .findOne({ where: { fk_user_id: user._id } })
          .then(result => {
            if (!result) {
              res.status(201).send({
                success: false,
                message: "마케터가 존재하지 않습니다.",
                error: null
              });
            } else {
              let oldProfileUrl = result.image_url.split("img")[1].slice(1);

              db.marketer_posts
                .destroy({ where: { fk_user_id: user._id } })
                .then(() => {
                  s3.deleteObject(
                    {
                      Bucket: "wake-up-file-server/post_img",
                      Key: oldProfileUrl
                    },
                    function(err, data) {
                      if (err) {
                        res.status(201).json({
                          success: false,
                          message: "ERRORS3 delete post_img",
                          error: err
                        });
                      } else {
                        res.status(201).json({
                          success: true,
                          message: "성공적으로 마케터를 삭제했습니다.",
                          error: null
                        });
                      }
                    }
                  );
                })
                .catch(err => {
                  res.status(201).json({
                    success: false,
                    message: "",
                    error: err
                  });
                });
            }
          })
          .catch(err => {
            res.status(201).json({
              success: false,
              message: "",
              error: err
            });
          });
      }
    })(req, res, next);
  },
  put: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        res.status(201).send("ERROR !! PUT /marketers : ", {
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
        db.marketer_posts
          .update(
            {
              title: req.body.title,
              content: req.body.content,
              image_url: req.body.image_url,
              avg_duration: req.body.avg_duration,
              category: req.body.category
            },
            { where: { fk_user_id: user._id } }
          )
          .then(() => {
            res.status(201).send({
              success: true,
              message: "성공적으로 수정되었습니다.",
              error: null
            });
          })
          .catch(err => {
            res.status(201).send({
              success: false,
              message: "",
              error: err
            });
          });
      }
    })(req, res, next);
  },
  upload: {
    post: (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
          res.status(200).send("ERROR !! POST /marketers/upload : ", {
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
          db.marketer_posts
            .findOne({
              where: {
                fk_user_id: user._id
              }
            })
            .then(async result => {
              console.log("RESULT :: ", result);
              if (result) {
                let oldProfileUrl = result.image_url.split("img")[1].slice(1);

                await s3.deleteObject(
                  {
                    Bucket: "wake-up-file-server/post_img",
                    Key: oldProfileUrl
                  },
                  function(err, data) {
                    if (err) {
                      res.status(201).json({
                        success: false,
                        message: "ERRORS3 upload post_img",
                        error: err
                      });
                    }
                  }
                );
              }
              upload.single("imageFile")(req, res, err => {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: "unable to create image",
                    error: err
                  });
                } else {
                  res.status(201).json({
                    success: true,
                    message: "",
                    error: null,
                    image_url: req.file.location
                  });
                }
              });
            });
        }
      })(req, res, next);
    }
  },
  latest: {
    get: (req, res) => {
      db.marketer_posts
        .findAll({
          limit: 12,
          order: [["createdAt", "DESC"]],
          include: [{ model: db.users }, { model: db.reviews }]
        })
        .then(result => {
          res.status(200).json({
            success: true,
            message: "",
            error: null,
            marketers: result.map(item => {
              let numberOfSales = 0;
              let avgStar = 0;
              let review_count = item.reviews.length;
              if (review_count) {
                let sumStar = 0;
                item.reviews.forEach(review => {
                  sumStar += review.star;
                });
                avgStar = Math.round((sumStar / review_count) * 2) / 2;
              }
              return {
                marketer_info: {
                  user_id: item.user._id,
                  nickname: item.user.nickname,
                  number_of_sales: numberOfSales,
                  avg_star: avgStar,
                  review_count: review_count
                },
                post: {
                  post_id: item._id,
                  title: item.title,
                  image_url: item.image_url
                }
              };
            })
          });
        });
      //   res.send("/marketers/test");
    }
  },
  nickname: {
    get: (req, res) => {
      db.users
        .findOne({
          where: { nickname: req.params.nickname },
          include: {
            model: db.marketer_posts,
            include: { model: db.reviews, include: { model: db.users } }
          }
        })
        .then(result => {
          if (result === null) {
            res.status(200).json({
              success: false,
              message: "존재하지 않는 마케터 입니다.",
              error: null
            });
          } else {
            let avgStar = 0;
            let review_count = result.marketer_posts[0].reviews.length;
            if (review_count) {
              let sumStar = 0;
              result.marketer_posts[0].reviews.forEach(review => {
                sumStar += review.star;
              });
              avgStar = Math.round((sumStar / review_count) * 2) / 2;
            }
            res.status(200).json({
              success: true,
              message: "",
              error: null,
              marketer_info: {
                user_id: result._id,
                profile_url: result.profile_url,
                avg_star: avgStar,
                review_count: review_count,
                nickname: result.nickname,
                number_of_sales: 0
              },
              post: {
                post_id: result.marketer_posts[0]._id,
                title: result.marketer_posts[0].title,
                content: result.marketer_posts[0].content,
                image_url: result.marketer_posts[0].image_url,
                avg_duration: result.marketer_posts[0].avg_duration,
                category: result.marketer_posts[0].category,
                created_at: result.marketer_posts[0].createdAt
              },
              reviews: result.marketer_posts[0].reviews.map(data => {
                return {
                  profile_url: data.user.profile_url,
                  nickname: data.user.nickname,
                  content: data.content,
                  star: data.star,
                  created_at: data.createdAt
                };
              })
            });
          }
        })
        .catch(err => {
          res.status(200).json({
            success: false,
            message: "",
            error: err
          });
        });
    }
  },
  user_id: {
    get: (req, res) => {
      if (!isNaN(parseInt(req.params.user_id))) {
        db.marketer_posts
          .findOne({
            where: { fk_user_id: parseInt(req.params.user_id) }
          })
          .then(result => {
            if (!result) {
              res.status(200).json({
                success: false,
                message: "마케터가 존재하지 않습니다.",
                error: null,
                is_marketer: false
              });
            } else {
              res.status(200).json({
                success: true,
                message: "",
                error: null,
                is_marketer: true,
                post: {
                  post_id: result._id,
                  title: result.title,
                  content: result.content,
                  image_url: result.image_url,
                  avg_duration: result.avg_duration,
                  category: result.category,
                  created_at: result.createdAt
                }
              });
            }
          })
          .catch(err => {
            res.status(200).json({
              success: false,
              message: "",
              error: err
            });
          });
        // res.send(req.params.user_id);
      } else {
        res.status(200).json({
          success: false,
          message: "잘못된 요청입니다. 파라미터를 확인하세요.",
          error: null
        });
      }
    }
  },
  test: {
    get: (req, res) => {
      console.log(req.params, "  ", req.query);
      res.send("/marketers/test");
    }
  }
};
