"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const Conversations_1 = __importDefault(require("../schemas/Conversations"));
const leaveRoom = (socket) => socket.on('leaveRoom', async (author, receiver) => {
    const users = [author, receiver];
    if (!Array.isArray(users))
        return;
    if (users.length !== 2)
        return;
    let conversation = await Conversations_1.default.find({ users: { $all: users } });
    if (Conversations_1.default.length && conversation[0] && conversation[0]._id) {
        (0, console_1.log)(`User with ID: ${socket.id} leaved ROOM:${conversation[0]._id}`); //CHECK
        socket.leave(conversation[0]._id.toString());
    }
});
exports.default = leaveRoom;
