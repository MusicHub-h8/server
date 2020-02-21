const express = require("express");
const router = express.Router();
const { RoomController } = require("../controllers/index");
const { authentication, roomAuthorization } = require("../middlewares");

router.use(authentication);
router.post("/", RoomController.create);
router.delete("/:id", roomAuthorization, RoomController.delete);

module.exports = router;
