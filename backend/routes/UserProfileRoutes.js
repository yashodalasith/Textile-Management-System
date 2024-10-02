const express = require('express');
const router = express.Router();

const UserProfileController = require("../Controllers/UserProfileController");

router.post("/",UserProfileController.getProfile)

module.exports =router;