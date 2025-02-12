
require('dotenv').config();
const jwt = require('jsonwebtoken');

const Users = require("../../models/Users");

const adminAuthorization = async (req, res, next) => {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];

    if (
        token === null ||
        token === undefined
    ) {
        console.error('Empty token')
        return res.status(401).end();
    };

    try {
         
        jwt.verify(token, process.env.ACCESS_TOKEN_ADMIN_SECRET);
    } catch (err) {
        console.error('Invalid token')
        return res.status(403).json({ message: 'invalid token' });
    }
     

    const { uid, refreshtoken } = jwt.decode(token);

    if (uid === null) {
        console.error('Null uid')
        return res.status(500).json({ message: 'null uid' })
    };
    if (refreshtoken === null) {
        console.error('Null refreshtoken')
        return res.status(500).json({ message: 'null refreshtoken' })
    };

    await Users.findOne({
        attributes: ['refreshtoken'],
        where: { uid: 'admin' }
    })
        .then((data) => {
            if (data === null) {
                console.error('auth user not found')
                return res.status(500).json({ message: 'auth user not found' })
            }

            else if (data.refreshtoken !== refreshtoken) {
                console.error('invalid token refresh')
                return res.status(403).json({ message: "invalid token refresh" })
            }

            else {
                 
                req.uid = uid;
                return next();
            };

        })
        .catch((e) => {
            console.error(e)
            return res.status(500).json({ message: "token error" })
        })
}

module.exports = adminAuthorization;