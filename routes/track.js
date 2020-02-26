const express = require("express");
const router = express.Router();
const { TrackController } = require("../controllers");
const { authentication, trackAuthorization } = require("../middlewares/index");

router.use(authentication);
router.post("/:roomId", TrackController.upload);
router.delete("/:id", trackAuthorization, TrackController.delete);
module.exports = router;
