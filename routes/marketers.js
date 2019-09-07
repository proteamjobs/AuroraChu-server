const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.get("/", controllers.marketers.get);
router.post("/", controllers.marketers.post);
// router.get("/:post_id")

router.get("/latest", controllers.marketers.latest.get);
router.get("/test", controllers.marketers.test.get);
router.get("/:post_id", (req, res) => {
  res.send("/marketers/:post_id");
});

module.exports = router;
