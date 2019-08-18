const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

/* GET users listing. */
// router.get("/", function(req, res, next) {
//   res.send("All Users Request.");
// });

router.get("/", controllers.users.get);
router.get("/:user_id", function(req, res, next) {
  console.log(req.params);
  res.send(`users/${req.params.user_id} Users Request.`);
});
router.get("/test", controllers.users.test.get);
router.put("/password", controllers.users.password.put);

// router.post("/:user_id", controllers.users.post);
router.post("/", controllers.users.post);

module.exports = router;
