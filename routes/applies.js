const express = require("express");
const path = require("path");
const router = express.Router();
const controllers = require("../controllers");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");
let s3 = new AWS.S3();
let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "wake-up-file-server/apply_file",
    key: function(req, file, cb) {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: "public-read-write"
  })
});

router.get("/status", controllers.applies.status.get);
router.delete("/", controllers.applies.delete);
router.get("/", controllers.applies.get);
router.post(
  "/",
  controllers.applies.get,
  upload.array("arrayFile"),
  controllers.applies.post
);

module.exports = router;
