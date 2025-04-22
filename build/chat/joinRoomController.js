"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const Conversations_1 = __importDefault(require("../schemas/Conversations"));
const inBoxController_1 = require("./inBoxController");
const joinRoom = (socket) => socket.on('joinRoom', async (author, receiver, access) => {
    const users = [author, receiver];
    if (!Array.isArray(users))
        return;
    if (users.length !== 2)
        return;
    let conversation = await Conversations_1.default.find({ users: { $all: users } });
    if (Conversations_1.default.length && conversation[0] && conversation[0]._id) {
        (0, console_1.log)(`User with ID: ${socket.id} joined ROOM:${conversation[0]._id}`); //CHECK
        // Limpa o inbox dessa pessoa nessa conversa:
        const idx = conversation[0].users.indexOf(author);
        conversation[0].inBox[idx] = false;
        conversation[0].save()
            .catch((e) => console.error(e));
        socket.join(conversation[0]._id.toString());
        socket.emit('conversation', conversation[0]);
    }
    else {
        await Conversations_1.default.create({
            users,
            messages: []
        })
            .then((conv) => {
            (0, console_1.log)(`User with ID: ${socket.id} joined ROOM:${conv._id}`); //CHECK
            socket.join(conv._id);
            socket.emit('conversation', conv);
        });
    }
    await (0, inBoxController_1.cleanInBox)(author, receiver);
});
exports.default = joinRoom;
