var express = require("express");
var router = express.Router();
let controllers = require("../controllers");

/* GET home page. */
router.get("/", controllers.exam.get);
router.post("/", controllers.exam.post);
router.put("/", controllers.exam.put);
router.get("/test", controllers.exam.test.get);

module.exports = router;
