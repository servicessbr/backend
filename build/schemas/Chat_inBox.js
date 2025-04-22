"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Chat_inBoxSchema = new mongoose_1.default.Schema({
    users_uid: {
        type: String,
        require: true,
        unique: true
    },
    senders_list: [
        {
            sender_uid: {
                type: String,
                require: false,
                unique: false
            },
            amount: {
                type: Number,
                require: true,
                default: 1,
                min: 1
            },
            last_text: {
                type: String,
                maxLength: 20
            }
        }
    ]
});
const Chat_inBox = mongoose_1.default.model('Chat_inBox', Chat_inBoxSchema);
exports.default = Chat_inBox;
