// const express = require("express");
// const { sendMessage, getMessages } = require("../controllers/messageController");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// // Route to send a message
// router.post("/", protect, sendMessage);

// // Route to fetch messages from a chat
// router.get("/:chatId", protect, getMessages);

// module.exports = router;
const express = require("express");
const { sendMessage, allMessages, deleteMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to send a message
router.post("/", protect, sendMessage);

// Route to get all messages from a specific chat
router.get("/:chatId", protect, allMessages);

//
router.delete('/message/:messageId', protect, deleteMessage);


module.exports = router;
