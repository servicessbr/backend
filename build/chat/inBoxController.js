"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInBox = exports.cleanInBox = void 0;
const Chat_inBox_1 = __importDefault(require("../schemas/Chat_inBox"));
const cleanInBox = async (author, receiver) => {
    await Chat_inBox_1.default.updateOne({ users_uid: author }, {
        $pull: {
            senders_list: { sender_uid: receiver }
        }
    }, { safe: true });
};
exports.cleanInBox = cleanInBox;
const addInBox = async (receiver, message) => {
    //Adiciona esse user ao inBox e a ultima mensagem enviada:
    const inBox = await Chat_inBox_1.default.findOne({ users_uid: receiver });
    // Confirma se o receiver já tem ou não um InBox:
    if (inBox) {
        // Prucara no sender_list o uid de quem envio a mensagem:
        const inBoxIndex = inBox.senders_list.findIndex(((obj) => obj.sender_uid === message.author));
        // Se não encontrar vai fazer o primeiro push:
        if (inBoxIndex === -1) {
            inBox.senders_list.push({
                sender_uid: message.author,
                amount: 1,
                last_text: message.text
            });
            inBox.users_uid = receiver;
        }
        else {
            // E se encontrou vau só alterar esses dois campos:
            inBox.senders_list[inBoxIndex].amount++;
            inBox.senders_list[inBoxIndex].last_text = message.text;
            await inBox.save()
                .catch((e) => console.error(e));
        }
    }
    else {
        await Chat_inBox_1.default.create({
            users_uid: receiver,
            senders_list: [
                {
                    sender_uid: message.author,
                    amount: 1,
                    last_text: message.text
                }
            ]
        }).catch((err) => console.error(err));
    }
};
exports.addInBox = addInBox;
