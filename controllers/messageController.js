const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Send a message
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    let newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
//delete a message


const deleteMessage = async (req, res) => {
  const { messageId } = req.params; // Get messageId from URL parameters

  // Ensure the user is authenticated (req.user should be set by the protect middleware)
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Find the message by its ID
    const message = await Message.findById(messageId).populate('sender chat');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const userId = req.user._id.toString();
    const senderId = message.sender._id.toString();
    
    // Assuming chat has participants array to validate receiver
    const isReceiver = message.chat.participants.includes(userId);

    if (!isReceiver && userId !== senderId) {
      return res.status(403).json({ message: 'You are not allowed to delete or hide this message' });
    }

    if (userId === senderId) {
      // If the current user is the sender, delete the message from the database
      await message.deleteOne();
      return res.status(200).json({ message: 'Message deleted successfully by the sender' });
    } else if (isReceiver) {
      // If the current user is the receiver, hide the message (set showToReceiver to false)
      if (!message.showToReceiver) {
        return res.status(400).json({ message: 'Message is already hidden' });
      }

      message.showToReceiver = false;
      await message.save();
      return res.status(200).json({ message: 'Message hidden for the receiver' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while deleting or hiding the message' });
  }
};

//


// Fetch all messages of a specific chat
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
    
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages, deleteMessage };
