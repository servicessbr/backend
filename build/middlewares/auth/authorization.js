"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const console_1 = require("console");
const Users_1 = __importDefault(require("../../models/Users"));
const authorization = async (req, res, next) => {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];
    if (token === null ||
        token === undefined) {
        return res.status(401).end();
    }
    ;
    try {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }
    catch (err) {
        return res.status(403).json({ message: 'invalide token' });
    }
    const { uid, email, refreshtoken } = jsonwebtoken_1.default.decode(token);
    if (uid === null) {
        return res.status(500).json({ message: 'null uid' });
    }
    ;
    if (refreshtoken === null) {
        return res.status(500).json({ message: 'null refreshtoken' });
    }
    ;
    //@ts-ignore
    await Users_1.default.findOne({
        attributes: ['refreshtoken', 'blocked', 'pro'],
        where: { uid }
    })
        .then((data) => {
        if (data === null) {
            return res.status(500).json({ message: 'auth user not found' });
        }
        else if (data.blocked) {
            return res.status(500).json({ message: 'Essa conta foi desativada por violar o art. ' + '12.6' });
        }
        else {
            //@ts-ignore
            req.uid = uid;
            //@ts-ignore
            req.email = email;
            //@ts-ignore
            req.pro = data.pro;
            return next();
        }
        ;
    })
        .catch((err) => {
        (0, console_1.error)(err);
        return res.status(500).json({ message: "token error" });
    });
};
exports.default = authorization;
