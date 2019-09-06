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
    bucket: "wake-up-file-server/profile_img",
    key: function(req, file, cb) {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: "public-read-write"
  })
});

/* GET users listing. */
// router.get("/", function(req, res, next) {
//   res.send("All Users Request.");
// });

router.get("/", controllers.users.get);
router.put("/withdrawal", controllers.users.withdrawal.put);
router.get("/verify", controllers.users.verify.get);
router.get("/:fk_user_id", function(req, res, next) {
  res.send(`users/${req.params.fk_user_id} Users Request.`);
});
router.get("/test", controllers.users.test.get);
router.put("/password", controllers.users.password.put);
router.put("/nickname", controllers.users.nickname.put);
router.put(
  "/profile_img",
  upload.single("imageFile"),
  controllers.users.profile_img.put
);
router.put("/profile_img/default", controllers.users.profile_img.default.put);

// router.post("/:fk_user_id", controllers.users.post);
router.post("/", controllers.users.post);

module.exports = router;
