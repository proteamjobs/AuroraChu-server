const express = require("express");
const path = require("path");
const router = express.Router();
const controllers = require("../controllers");
const multer = require("multer");
const multerS3 = require("multer-s3");

const AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");

let s3 = new AWS.S3();

router.get("/", controllers.marketers.get);
router.post("/", controllers.marketers.post);
router.put("/", controllers.marketers.put);
router.post("/upload", controllers.marketers.upload.post);
router.delete("/", controllers.marketers.delete);
// router.get("/:post_id")
router.get("/latest", controllers.marketers.latest.get);
router.get("/@:nickname", controllers.marketers.nickname.get);

router.get("/:user_id", controllers.marketers.user_id.get);
router.get("/test", controllers.marketers.test.get);

module.exports = router;
