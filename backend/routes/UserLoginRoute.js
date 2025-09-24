const express = require("express");
const router = express.Router();

const UserLoginController = require("../Controllers/LoginController");

router.post("/", UserLoginController.loginUser);
router.post("/logout", UserLoginController.logoutUser);
router.post("/refresh", UserLoginController.refreshTokens);
module.exports = router;
