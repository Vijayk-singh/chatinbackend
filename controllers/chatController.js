const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Create or fetch a one-to-one chat
const accessChat = asyncHandler(async (req, res) => {
  const {  currentUserId, selectedUserId } = req.body;

  if (!currentUserId || !selectedUserId) {
    return res.status(400).send("UserId param not sent with request");
  }

  // Check if chat exists between the logged-in user and the provided userId
  let chat = await Chat.findOne({
    // isGroupChat: false,
    users: { $all: [ currentUserId, selectedUserId] }, // Ensure both users are part of the chat
  });

  // If chat exists, return the chat ID
  if (chat) {
    return res.status(200).json({ chatId: chat._id });
  } else {
    // If no chat exists, create a new one
    const newChat = {
      chatName: "sender",
      isGroupChat: false,
      users: [ currentUserId, selectedUserId], // Add both users
    };

    try {
      const createdChat = await Chat.create(newChat);
      res.status(201).json({ chatId: createdChat._id });
    } catch (error) {
      res.status(400).send({ message: "Error creating chat", error });
    }
  }
});

module.exports = { accessChat };
