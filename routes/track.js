const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { TrackController } = require("../controllers/index");
const tracks = require("../middlewares/tracks");

router.use(authentication);

// router.post(
//   "/",
//   tracks.multer.single("track"),
//   tracks.sendUploadToGCS,
//
// );
router.post(
  "/:roomId",
  tracks.multer.single("track"),
  tracks.sendUploadToGCS,
  TrackController.upload
);
module.exports = router;
