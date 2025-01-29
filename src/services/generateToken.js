require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateToken (uid, email, refreshtoken) {

    return jwt.sign(
        { uid, email, refreshtoken },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: '360d' }
    );
}

module.exports = generateToken;