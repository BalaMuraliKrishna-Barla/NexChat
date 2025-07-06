const expressAsyncHandler = require("express-async-handler");
const Chat = require("./../models/chatModel");
const User = require("./../models/userModel");
// This function is for creating or fetching a one-on-one chat
const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId param not sent with the request!!");
    res.status(400);
    return;
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.json(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.find({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(FullChat);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  }
});

const fetchChats = expressAsyncHandler(async (req, res) => {
  try {
    const results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populatedResults = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(populatedResults);
  } catch (err) {
    throw new Error(err.message);
  }
});

const deleteChat = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.body;

  // Find the chat and check if it exists
  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(400);
    throw new Error("Chat Not Found");
  }

  // Check if the user is one of the participants
  if (!chat.users.includes(req.user._id)) {
    res.status(403);
    throw new Error("You are not a participant in this chat");
  }

  try {
    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
  // The body is already parsed by express.json()
  if (!req.body.users || !req.body.name) {
    return res
      .status(400)
      .send({ message: "Please provide a name and users for the group" });
  }

  // 'users' should already be an array
  var users = req.body.users;

  if (!Array.isArray(users) || users.length < 2) {
    return res
      .status(400)
      .send({ message: "A group chat requires at least 2 other users." });
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    // res.status(200).json({mk: groupChat});

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const updateGroupDetails = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName, groupIcon } = req.body;

  const updateData = {};
  if (chatName) updateData.chatName = chatName;
  if (groupIcon) updateData.groupIcon = groupIcon;

  const updatedChat = await Chat.findByIdAndUpdate(chatId, updateData, {
    new: true,
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(updatedChat);
  }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(400);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(added);
  }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(400);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(removed);
  }
});

const deleteGroupChat = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.body;

  // Find the chat and check if it exists
  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(400);
    throw new Error("Chat Not Found");
  }

  // Check if the user is the group admin
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not authorized to delete this group chat");
  }

  try {
    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ message: "Group chat deleted successfully" });
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  deleteChat,
  createGroupChat,
  updateGroupDetails,
  addToGroup,
  removeFromGroup,
  deleteGroupChat,
};
