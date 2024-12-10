const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler( async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try { // req.headers.authorization : Bearer abcdef...
            token = req.headers.authorization.split(" ")[1]; // abcdefgh... 
            const decoded = jwt.verify(token, process.env.SECRET_KEY); 
            
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (err) {
            res.status(401);
            throw new Error("Something wrong");
        }
    }

    if(!token) {
        res.status(401);
        throw new Error("No token exists!");
    }
});

module.exports = { protect };