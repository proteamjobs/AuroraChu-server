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
    bucket: "wake-up-file-server/post_img",
    key: function(req, file, cb) {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: "public-read-write"
  })
});

router.get("/", controllers.marketers.get);
router.post("/", controllers.marketers.post);
router.post(
  "/upload",
  (req, res, next) => {
    upload.single("imageFile")(req, res, err => {
      if (err) {
        res.status(400).json({
          success: false,
          message: "unable to create image",
          error: err
        });
      } else {
        next();
      }
    });
  },
  controllers.marketers.upload.post
);
router.delete("/", controllers.marketers.delete);
// router.get("/:post_id")
router.get("/latest", controllers.marketers.latest.get);
router.get("/@:nickname", controllers.marketers.nickname.get);

router.get("/:user_id", controllers.marketers.user_id.get);
router.get("/test", controllers.marketers.test.get);

module.exports = router;
