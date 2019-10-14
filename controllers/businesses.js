const passport = require("passport");
const db = require("../models");

module.exports = {
  get: (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err) {
          res.status(200).json("ERROR !! /businesses ", {
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
          let purchaseList = await db.businesses.findAll({
            where: { fk_buyer_id: user._id }
          });
          // let saleList = await db.businesses.findAll({
          //   where: { fk_post_id: user._id }
          // });
          // res.json({ purchaseList, saleList });

          let { businesses: saleList } = await db.marketer_posts.findOne({
            where: { fk_user_id: user._id },
            include: { model: db.businesses }
          });
          res.json({
            success: true,
            message: "성공적으로 검색되었습니다.",
            error: null,
            purchaseList: purchaseList.map(data => {
              return {
                purchaseId: data._id,
                unitPrice: data.unit_price,
                purchaseCount: data.purchase_count,
                totalPrice: data.total_price,
                finalAmount: data.final_amount,
                useCredit: data.use_credit,
                trade: data.trade,
                isConfirm: data.is_Confirm,
                requirement: data.requirement,
                status: data.status,
                purchasDate: data.createdAt
              };
            }),
            saleList: saleList.map(data => {
              return {
                purchaseId: data._id,
                unitPrice: data.unit_price,
                purchaseCount: data.purchase_count,
                totalPrice: data.total_price,
                finalAmount: data.final_amount,
                useCredit: data.use_credit,
                trade: data.trade,
                isConfirm: data.is_Confirm,
                requirement: data.requirement,
                status: data.status,
                saleDate: data.createdAt
              };
            })
          });
        }
      }
    )(req, res, next);
  },
  post: (req, res, next) => {
    const { postId, purchaseCount, useCredit, trade, requirement } = req.body;
    const unitPrice = 9000;
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        res.status(201).send("ERROR !! /businesses ", {
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
        let totalPrice = unitPrice * purchaseCount;
        let finalAmount = totalPrice - useCredit;
        db.businesses
          .create({
            fk_buyer_id: user._id,
            fk_post_id: postId,
            unit_price: unitPrice,
            purchase_count: purchaseCount,
            use_credit: useCredit,
            total_price: totalPrice,
            final_amount: finalAmount,
            requirement: requirement,
            trade: trade
          })
          .then(() => {
            res.status(201).json({
              success: true,
              message: "성공적으로 입력되었습니다.",
              error: null
            });
          })
          .catch(err => {
            res.status(200).send({
              success: false,
              message: "POST /businesses",
              error: err
            });
          });
      }
    })(req, res, next);
  },
  test: {
    get: (req, res, next) => {
      res.send("GET /businesses/test");
    }
  }
};
