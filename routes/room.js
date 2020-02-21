const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { RoomController } = require("../controllers/index");

router.use(authentication);
router.post("/", RoomController.create);
router.delete("/:id", RoomController.delete);

module.exports = router;
