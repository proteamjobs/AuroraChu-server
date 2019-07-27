var express = require("express");
var router = express.Router();
const controllers = require("../controllers");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get("/test", controllers.users.test.get);

module.exports = router;
