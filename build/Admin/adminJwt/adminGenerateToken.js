"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function adminGenerateToken(uid, refreshtoken) {
    return jsonwebtoken_1.default.sign({ uid, refreshtoken }, process.env.ACCESS_TOKEN_ADMIN_SECRET, { expiresIn: '1200s' });
}
exports.default = adminGenerateToken;
