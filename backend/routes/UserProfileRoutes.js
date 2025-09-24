const express = require('express');
const router = express.Router();

const UserProfileController = require("../Controllers/UserProfileController");

router.get("/",UserProfileController.getProfile)

module.exports =router;