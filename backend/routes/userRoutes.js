const express = require('express');
const { registerUser, authUser, getAllUsers } = require('../controllers/userControllers.js');
// const chats = require("./backend/chats");
const { protect } = require('../middleware/authMiddleWare.js');
const router = express.Router()

router.post('/signup', registerUser);
router.post('/login', authUser);
// router.get('/chats', chats)
router.get('/', protect, getAllUsers);

module.exports = router;