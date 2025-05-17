"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(uid, email, name, refreshtoken) {
    return jsonwebtoken_1.default.sign({ uid, email, name, refreshtoken }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '360d' });
}
exports.default = generateToken;
