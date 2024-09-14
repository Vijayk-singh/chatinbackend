const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat } = require("../controllers/chatController");

const router = express.Router();

// Route to access or create a new chat
router.post("/", protect, accessChat);

module.exports = router;
