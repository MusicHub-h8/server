const express = require("express");
const router = express.Router();
const { TrackController } = require("../controllers");
const {
  authentication,
  tracks,
  trackAuthorization
} = require("../middlewares/index");

router.use(authentication);
router.post(
  "/:roomId",
  tracks.multer.single("track"),
  tracks.sendUploadToGCS,
  TrackController.upload
);
router.delete("/:id", trackAuthorization, TrackController.delete);
module.exports = router;
