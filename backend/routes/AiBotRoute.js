const express = require("express");
const { getChatbotResponse } = require("../controller/chatbot.controller");
const router = express.Router();

router.post("/submit", getChatbotResponse);
module.exports = router;
