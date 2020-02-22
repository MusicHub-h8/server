const express = require("express");
const router = express.Router();
const { RoomController } = require("../controllers/index");
const { authentication, roomAuthorization } = require("../middlewares");

router.use(authentication);
router.get("/me", RoomController.fetchMyRooms);
router.get("/:id", RoomController.getRoomDetail);
router.post("/", RoomController.create);
router.post("/:roomId/invite/:userId", RoomController.invite);
router.patch("/:roomId/invite/:userId", RoomController.acceptInvite);
router.patch(
  "/:roomId/remove/:userId",
  roomAuthorization,
  RoomController.removeMember
);
router.delete("/:roomId", roomAuthorization, RoomController.delete);
module.exports = router;
