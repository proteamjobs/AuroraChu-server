var express = require("express");
var router = express.Router();
let controllers = require("../controllers");

/* GET home page. */
router.post("/login", controllers.auth.login.post);
router.get("/me", controllers.auth.me.get);

module.exports = router;
