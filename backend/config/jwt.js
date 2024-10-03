const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    const key = process.env.SECRET_KEY;
    // console.log(key);
    const token = jwt.sign({ id }, key, { expiresIn:'30d'})
    return token
}

module.exports = generateToken
