var express = require("express");
var router = express.Router();
let controller = require("../controllers");

/* GET home page. */
router.post("/login", controller.auth.login.post);

module.exports = router;
