"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chat_channelSchema = new mongoose_1.default.Schema({
    uid: {
        type: String,
        require: true,
        unique: true
    },
    ExponentPushToken: {
        type: String,
        require: true
    },
});
const Chat_Channel = mongoose_1.default.model('Chat_Channel', chat_channelSchema);
exports.default = Chat_Channel;
