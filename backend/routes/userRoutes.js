const express = require('express');
const {
  registerUser,
  authUser,
  getAllUsers,
  updateUserProfile,
} = require("../controllers/userControllers.js");
// const chats = require("./backend/chats");
const { protect } = require('../middleware/authMiddleWare.js');
const router = express.Router()

router.post('/signup', registerUser);
router.post('/login', authUser);
// router.get('/chats', chats)
router.get('/', protect, getAllUsers);
router.put("/profile", protect, updateUserProfile);

module.exports = router;