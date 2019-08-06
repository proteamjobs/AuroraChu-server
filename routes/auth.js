var express = require("express");
var router = express.Router();
let controllers = require("../controllers");

/* GET home page. */
router.post("/login", controllers.auth.login.post);
router.get("/me", controllers.auth.me.get);
router.get("/verify", controllers.auth.verify.get);

module.exports = router;
