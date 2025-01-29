require('dotenv').config();
const jwt = require('jsonwebtoken');

function adminGenerateToken(uid, refreshtoken) {

    return jwt.sign(
        { uid, refreshtoken },
        /*@ts-ignore*/
        process.env.ACCESS_TOKEN_ADMIN_SECRET,
        { expiresIn: '1200s' }
    );
}

module.exports = adminGenerateToken;