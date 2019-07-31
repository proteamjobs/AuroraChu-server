const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("All Users Request.");
});
router.get("/:user_id", function(req, res, next) {
  console.log(req.params);
  res.send(`users/${req.params.user_id} Users Request.`);
});
router.get("/test", controllers.users.test.get);

module.exports = router;
