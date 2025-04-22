"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Conversations_1 = __importDefault(require("../schemas/Conversations"));
/*
    * Functions:
*/
const chatList_1 = __importDefault(require("../functions/chatList"));
const Chat_inBox_1 = __importDefault(require("../schemas/Chat_inBox"));
const chatList = (socket) => socket.on('chatList', async (uid) => {
    const inBox = await Chat_inBox_1.default.findOne({ users_uid: uid });
    const conversation = await Conversations_1.default.find({ users: { $all: uid } });
    const list = [];
    conversation.map((it) => {
        const idx = it.users.indexOf(uid);
        if (it.messages.length)
            list.push({
                receiver: idx === 0 ? it.users[1] : it.users[0],
                inBox: it.inBox[idx]
            });
    });
    (0, chatList_1.default)(list).then((newList) => {
        socket.emit('loadList', { list: newList, inBox });
        //socket.to(socket.id).emit('loadList', newList);
    });
});
exports.default = chatList;
