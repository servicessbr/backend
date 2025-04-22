"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const conversationSchema = new mongoose_1.default.Schema({
    users: [String],
    inBox: {
        type: [Boolean],
        required: true,
        default: [false, false]
    },
    messages: [
        {
            text: {
                type: String,
                require: true
            },
            author: {
                type: String,
                require: true
            },
            time: {
                type: String,
                require: true
            },
            date: {
                type: Date,
                require: true
            }
        }
    ]
});
const Conversation = mongoose_1.default.model('Conversation', conversationSchema);
exports.default = Conversation;
