var express = require("express");
var router = express.Router();
let controllers = require("../controllers");

/* GET home page. */
router.get("/", controllers.businesses.get);
router.post("/", controllers.businesses.post);
// router.put("/", controllers.businesses.put);
router.get("/test", controllers.businesses.test.get);

module.exports = router;
