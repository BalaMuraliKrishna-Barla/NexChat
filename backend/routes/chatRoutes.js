const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
  deleteGroupChat,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);

router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroupChat);
router.route("/delete-group").delete(protect, deleteGroupChat);

router.route("/add-to-group").put(protect, addToGroup);
router.route("/remove-from-group").put(protect, removeFromGroup);

module.exports = router;
