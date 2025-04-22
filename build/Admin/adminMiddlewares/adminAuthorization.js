"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../../models/Users"));
const adminAuthorization = async (req, res, next) => {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];
    if (token === null ||
        token === undefined) {
        console.error('Empty token');
        return res.status(401).end();
    }
    ;
    try {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_ADMIN_SECRET);
    }
    catch (err) {
        console.error('Invalid token');
        return res.status(403).json({ message: 'invalid token' });
    }
    //@ts-ignore
    const { uid, refreshtoken } = jsonwebtoken_1.default.decode(token);
    if (uid === null) {
        console.error('Null uid');
        return res.status(500).json({ message: 'null uid' });
    }
    ;
    if (refreshtoken === null) {
        console.error('Null refreshtoken');
        return res.status(500).json({ message: 'null refreshtoken' });
    }
    ;
    //@ts-ignore
    await Users_1.default.findOne({
        attributes: ['refreshtoken'],
        where: { uid: 'admin' }
    })
        .then((data) => {
        if (data === null) {
            console.error('auth user not found');
            return res.status(500).json({ message: 'auth user not found' });
        }
        //@ts-ignore
        else if (data.refreshtoken !== refreshtoken) {
            console.error('invalid token refresh');
            return res.status(403).json({ message: "invalid token refresh" });
        }
        else {
            //@ts-ignore
            req.uid = uid;
            return next();
        }
        ;
    })
        .catch((e) => {
        console.error(e);
        return res.status(500).json({ message: "token error" });
    });
};
exports.default = adminAuthorization;
