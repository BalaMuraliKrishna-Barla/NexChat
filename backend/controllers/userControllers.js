const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js');
const generateToken = require('../config/jwt.js');
const bcryptjs = require('bcryptjs')

const hashPassword = asyncHandler(async (password) => {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt)
    return hashedPassword;
}) 

const registerUser = asyncHandler(async (req, res) => {
    
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password) {
        res.json({ message: "Please fill in all fields" });
        return;
    }
    
    const userExits = await User.findOne({email})
    if(userExits) {
        res.json({ message: "Email already exists!" });
        return;
    }

    
    const hashedPassword = await hashPassword(password);
    // console.log(`password : ${password}`);
    // console.log(`hashed password : ${hashedPassword}`);

    const user = await User.create({ name, email, password : hashedPassword, pic })
    
    if(user) {
        res.status(201).json({
            message : `Registration success!`,
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token : generateToken(user._id)
        })
    } else {
        res.json({ message: "Failed in creating a user!" });
        return;
    }
})

const matchPassword = asyncHandler(async(pass, hashedPass) => await bcryptjs.compare(pass, hashedPass))

const authUser = asyncHandler(async (req, res) => {
    const { email, password} = req.body;

    const validUser = await User.findOne({email})

    if(validUser && matchPassword(password, validUser.password)) {
        res.status(200).json({
            message: `Login success!`,
            _id: validUser._id,
            name: validUser.name,
            password : validUser.password,
            email: validUser.email,
            pic: validUser.pic,
            token: generateToken(validUser._id),
        });
    }else {
        res.json({message : "Password mismatch!"})
    }
})

module.exports = { registerUser, authUser }