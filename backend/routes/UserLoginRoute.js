const express = require('express');
const router = express.Router();

const UserLoginController = require('../Controllers/LoginController');

router.post("/",UserLoginController.loginUser);
module.exports=router;