const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers/index");
const authentication = require("../middlewares/authentication");

router.post("/login", UserController.login);
router.post("/dummies", UserController.generateDummies);
router.use(authentication);
router.get("/", UserController.fetchAllUsers);
router.get("/me", UserController.getUserDetails);
router.get("/recommendations", UserController.getRecommendedUser);
router.patch("/instruments", UserController.addInstruments);
module.exports = router;
