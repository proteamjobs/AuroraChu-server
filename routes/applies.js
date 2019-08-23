const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.get("/status", controllers.applies.status.get);

module.exports = router;
