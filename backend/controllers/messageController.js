// backend/controllers/messageController.js

const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// sendMessage function remains unchanged.
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, fileUrl, fileType } = req.body;
  if (!chatId || (!content && !fileUrl)) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    fileUrl: fileUrl,
    fileType: fileType,
    chat: chatId,
  };
  
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Get all messages for a chat
// @route   GET /api/message/:chatId
// @access  Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    // FIX: Update logic to use the new 'isRead' flag.
    // Mark all messages in this chat not sent by the current user as read.
    await Message.updateMany(
      { chat: req.params.chatId, sender: { $ne: req.user._id } },
      { isRead: true }
    );

    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
