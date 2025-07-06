const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  addToGroup,
  removeFromGroup,
  deleteGroupChat,
  deleteChat,
  updateGroupDetails,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/delete-chat").delete(protect, deleteChat);

router.route("/group").post(protect, createGroupChat);
router.route("/group/update").put(protect, updateGroupDetails);
router.route("/delete-group").delete(protect, deleteGroupChat);

router.route("/add-to-group").put(protect, addToGroup);
router.route("/remove-from-group").put(protect, removeFromGroup);

module.exports = router;
