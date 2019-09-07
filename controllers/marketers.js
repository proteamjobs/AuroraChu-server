const passport = require("passport");
const db = require("../models");

module.exports = {
  get: (req, res) => {
    console.log(req.params);
    if (!Object.keys(req.query).length) {
      res.send("/marketers");
    } else if (req.query.category) {
      res.send("/marketers?category=" + req.query.category);
    } else {
      res.send("ERROR :: /marketers :: Query String or Path URL.");
    }
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
  latest: {
    get: (req, res) => {
      res.status(200).json(fakeMarketesLatest);
      //   res.send("/marketers/test");
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
