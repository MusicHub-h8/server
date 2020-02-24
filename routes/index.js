const express = require("express");
const router = express.Router();
const trackRouter = require("./track");
const roomRouter = require("./room");
const userRouter = require("./user");
const socketIo = require("socket.io");

router.use("/users", userRouter);
router.use("/rooms", roomRouter);
router.use("/tracks", trackRouter);

module.exports = router;
