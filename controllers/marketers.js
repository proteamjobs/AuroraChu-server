const passport = require("passport");
const db = require("../models");
const AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");

let s3 = new AWS.S3();

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
  upload: {
    post: (req, res) => {
      res.status(201).json({
        success: true,
        message: "",
        error: null,
        image_url: req.file.location
      });
    }
  },
  latest: {
    get: (req, res) => {
      res.status(200).json(fakeMarketesLatest);
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

let fakeMarketesLatest = {
  data: [
    {
      marketer_id: 1,
      post_id: 1,
      user_name: "재규어 중사",
      title:
        "홍보 마케팅 전문 입니다. 반갑습니다. 테스트 재규어 중사 입니다. 저렴합니다.",
      image_url:
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 2,
      post_id: 2,
      user_name: "JM",
      title: "간호 / 보건 / 복지 / 사회적 마케팅 전문 입니다.",
      image_url: "https://i-msdn.sec.s-msft.com/dynimg/IC866065.png",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 3,
      post_id: 3,
      user_name: "Kids01",
      title: "IT 홈페이지 제작 전문 업체입니다. 마케팅 도와드립니다.",
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzBBhilTl7Qmc1V0F30WHWKsJSYRz-MLs7t099UbCzRO86rXbhgQ",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 4,
      post_id: 4,
      user_name: "underscore",
      title: "금융관련 전공자 입니다. ",
      image_url:
        "http://blog.edx.org/wp-content/uploads/2017/01/android-featured.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 5,
      post_id: 5,
      user_name: "untitled",
      title: "다자인 / 판넬 / 업체 홍보 전문가입니다.",
      image_url:
        "https://cdn2.hubspot.net/hubfs/820873/Imported_Blog_Media/how-to-evaluate-and-hire-an-android-developer-2.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 6,
      post_id: 6,
      user_name: "untitled",
      title:
        "다자인 / 판넬 / 업체 홍보 전문가입니다.다자인 / 판넬 / 업체 홍보 전문가입니다.다자인 / 판넬 / 업체 홍보 전문가입니다.다자인 / 판넬 / 업체 홍보 전문가입니다.",
      image_url:
        "https://www.bullseyetechgroup.com/wp-content/uploads/2018/06/Cost-of-web-development-in-Canada-e1526618777824.jpg",
      avg_star: 3.5,
      number_of_sales: 1
    },
    {
      marketer_id: 1,
      post_id: 1,
      user_name: "재규어 중사",
      title:
        "홍보 마케팅 전문 입니다. 반갑습니다. 테스트 재규어 중사 입니다. 저렴합니다.",
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTim_e7vlTspKdojxKrmJHsVopc984L4hcaGq-w8L7HMUnsC429",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 2,
      post_id: 2,
      user_name: "JM",
      title: "간호 / 보건 / 복지 / 사회적 마케팅 전문 입니다.",
      image_url:
        "https://techcrunchjp.files.wordpress.com/2018/03/gettyimages-697538579.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 3,
      post_id: 3,
      user_name: "Kids01",
      title: "IT 홈페이지 제작 전문 업체입니다. 마케팅 도와드립니다.",
      image_url:
        "https://makeawebsitehub.com/wp-content/uploads/2017/04/wordpress-923188_640.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 4,
      post_id: 4,
      user_name: "underscore",
      title: "금융관련 전공자 입니다. ",
      image_url:
        "https://miro.medium.com/max/916/1*YVkK570-GSHyqtiEiIi6Xw.jpeg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 5,
      post_id: 5,
      user_name: "untitled",
      title: "다자인 / 판넬 / 업체 홍보 전문가입니다.",
      image_url:
        "http://pan-creators.com/wp-content/uploads/2018/02/%EC%82%AC%EC%A7%84-1.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 6,
      post_id: 6,
      user_name: "untitled",
      title:
        "다자인 / 판넬 / 업체 홍보 전문가입니다.다자인 / 판넬 / 업체 홍보 전문가입니다.다자인 / 판넬 / 업체 홍보 전문가입니다.다자인 / 판넬 / 업체 홍보 전문가입니다.",
      image_url:
        "https://cdn.pixabay.com/photo/2015/03/01/11/17/arrangement-654573_960_720.jpg",
      avg_star: 3.5,
      number_of_sales: 1
    }
  ]
};

// let temp =
// {
//   success: Boolean,
//   message: String,
//   error: String,
//   marketer_info: {
//     user_id: Number,
//     profile_url: String,
//     avg_star: Number,
//     nickname: String,
//     number_of_sales: Number
//   },
//   post: {
//     post_id: Number,
//     title: String,
//     content: String,
//     image_url: String,
//     avg_duration: Number,
//     category: String,
//     created_at: String
//   },
//   reviews: [
//     {
//       profile_url: String,
//       nickname: String,
//       content: String,
//       star: Number,
//       created_at: String
//     }
//   ]
// };
