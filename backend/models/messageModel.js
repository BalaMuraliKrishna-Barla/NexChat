// backend/models/messageModel.js
const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true }, // Text content, now optional
    fileUrl: { type: String }, // URL of the uploaded file
    fileType: { type: String }, // e.g., 'image/png', 'application/pdf'
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    isRead: {
      type: Boolean,
      default: false,
    },
    parentMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageModel);
module.exports = Message;