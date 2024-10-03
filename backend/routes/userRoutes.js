const { registerUser, authUser } = require('../controllers/userControllers.js');
const express = require('express')
const router = express.Router()

router.post('/signup', registerUser)
router.post('/login', authUser)

module.exports = router;