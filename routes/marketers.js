const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.get("/", controllers.marketers.get);
router.post("/", controllers.marketers.post);
// router.get("/:post_id")

router.get("/@:nickname", controllers.marketers.nickname.get);
router.get("/:category", (req, res) => {
  res.send("GET /#:category");
});
router.get("/latest", controllers.marketers.latest.get);
router.get("/test", controllers.marketers.test.get);

module.exports = router;
