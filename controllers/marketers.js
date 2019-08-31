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
      image_url:
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 3,
      post_id: 3,
      user_name: "Kids01",
      title: "IT 홈페이지 제작 전문 업체입니다. 마케팅 도와드립니다.",
      image_url:
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 4,
      post_id: 4,
      user_name: "underscore",
      title: "금융관련 전공자 입니다. ",
      image_url:
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 5,
      post_id: 5,
      user_name: "untitled",
      title: "다자인 / 판넬 / 업체 홍보 전문가입니다.",
      image_url:
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
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
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
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
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 2,
      post_id: 2,
      user_name: "JM",
      title: "간호 / 보건 / 복지 / 사회적 마케팅 전문 입니다.",
      image_url:
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 3,
      post_id: 3,
      user_name: "Kids01",
      title: "IT 홈페이지 제작 전문 업체입니다. 마케팅 도와드립니다.",
      image_url:
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 4,
      post_id: 4,
      user_name: "underscore",
      title: "금융관련 전공자 입니다. ",
      image_url:
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
      avg_star: 0,
      number_of_sales: 0
    },
    {
      marketer_id: 5,
      post_id: 5,
      user_name: "untitled",
      title: "다자인 / 판넬 / 업체 홍보 전문가입니다.",
      image_url:
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
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
        "https://d2v80xjmx68n4w.cloudfront.net/gigs/tqQcB1558974577.jpg",
      avg_star: 3.5,
      number_of_sales: 1
    }
  ]
};
