const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js');
const generateToken = require('../config/jwt.js');
const bcryptjs = require('bcryptjs')

const hashPassword = asyncHandler(async (password) => {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt)
    return hashedPassword;
});

const registerUser = asyncHandler(async (req, res) => {
    
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password) {
        res.status(400).json({ message: "Please fill in all fields" }); // FIX
        return;
    }
    
    const userExits = await User.findOne({email})
    if(userExits) {
        res.status(400).json({ message: "Email already exists!" }); // FIX
        return;
    }

    const hashedPassword = await hashPassword(password);

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
        console.log("Registration failed");
        return;
    }
});

const matchPassword = asyncHandler(async(pass, hashedPass) => 
    await bcryptjs.compare(pass, hashedPass)
);

const authUser = asyncHandler(async (req, res) => {
    const { email, password} = req.body;

    const validUser = await User.findOne({email})
    if(!validUser) 
        res.json({message: "User not exists!"});
    
    const isMatched = await matchPassword(password, validUser.password);
    if(isMatched) {
        res.status(200).json({
            message: `Login success!`,
            _id: validUser._id,
            name: validUser.name,
            // password : validUser.password,
            email: validUser.email,
            pic: validUser.pic,
            token: generateToken(validUser._id),
        });
    }else {
        res.status(401).json({ message: "Invalid Email or Password" });
    }
});


const getAllUsers = asyncHandler(async (req, res) => {
    // building a query to search users when provided the search variable 
    const keyword = req.query.search
    ? {
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ]
    } : {}; // if not then the query empty

    let currentUserId = req.user._id;
    console.log(await User.find({_id: {$eq: currentUserId}}));
    
    // finding all the users except the current user 
    const users = await User.find(keyword).find({ _id: { $ne: currentUserId }});
    
    res.send(users);
    
});

module.exports = { registerUser, authUser, getAllUsers }