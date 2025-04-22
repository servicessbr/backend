"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pushNotifications_1 = __importDefault(require("../mobile/pushNotifications"));
const Chat_Channel_1 = __importDefault(require("../schemas/Chat_Channel"));
const Conversations_1 = __importDefault(require("../schemas/Conversations"));
const inBoxController_1 = require("./inBoxController");
const sendMessage = (socket, connected_users) => socket.on('sendMessage', async (room, message, access) => {
    if (typeof room !== 'string')
        return;
    if (room.length !== 24)
        return;
    const conversation = await Conversations_1.default.findOne({ _id: room });
    if (!conversation)
        return;
    const receiver = conversation.users.filter((r) => r !== message.author)[0];
    /*
        * Encontra o ExpoPushToken de quem vai recer a notificação:
    */
    const channel = await Chat_Channel_1.default.findOne({ uid: receiver });
    /*
        * Confirma se o usuáro que vai receber a notificação(pelo uid) está online ou não:
        * Esse estará online caso esteja na varial c.
    */
    const isOnline = Boolean(Object.keys(connected_users).find(key => connected_users[key] === receiver));
    conversation.messages.push(message);
    /*
        * Limpa o in box dessa pessoa nessa conversa:
    */
    const idx = conversation.users.indexOf(message.author);
    conversation.save()
        .catch((e) => console.error(e));
    socket.to(room).emit('receivedMessage', message);
    /*
        * Se o receiver tiver online acaba aqui:
    */
    if (isOnline)
        return;
    await (0, inBoxController_1.addInBox)(receiver, message);
    if (!channel)
        return;
    /*
        * Executa a notifição:
    */
    return (0, pushNotifications_1.default)([
        {
            to: channel.ExponentPushToken,
            sound: 'default',
            body: message.text.substring(0, 19),
            data: {},
        }
    ]);
});
exports.default = sendMessage;
