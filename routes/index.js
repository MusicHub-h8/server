const express = require("express");
const router = express.Router();
const trackRouter = require("./track");
const roomRouter = require("./room");
const userRouter = require("./user");

router.get("/", (req, res) => {
  res.send("musichub");
});
router.use("/users", userRouter);
router.use("/rooms", roomRouter);
router.use("/tracks", trackRouter);

module.exports = router;
