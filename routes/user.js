const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers/index");
const authentication = require("../middlewares/authentication");

router.post("/login", UserController.login);
router.use(authentication);
router.get("/recommendations", UserController.getRecommendedUser);

module.exports = router;
