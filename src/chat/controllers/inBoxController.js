//const Conversation = require("../../schemas/Conversations");

//const { log } = require('console');
//const Conversation = require("../../schemas/Conversations");
const Chat_inBox = require('../../schemas/Chat_inBox');


const cleanInBox = async (author, receiver) => {
    await Chat_inBox.updateOne(
        { users_uid: author },
        {
            $pull: {
                senders_list: { sender_uid: receiver }
            }
        },
        { safe: true }
    );
}

const addInBox = async (receiver, message) => {
    //Adiciona esse user ao inBox e a ultima mensagem enviada:
    const inBox = await Chat_inBox.findOne({ users_uid: receiver });

    // Confirma se o receiver já tem ou não um InBox:
    if (inBox) {
        // Prucara no sender_list o uid de quem envio a mensagem:
        const inBoxIndex = inBox.senders_list.findIndex(((obj) => obj.sender_uid === message.author));

        // Se não encontrar vai fazer o primeiro push:
        if (inBoxIndex === -1) {
            inBox.senders_list.push({
                /*@ts-ignore*/
                users_uid: receiver,
                senders_list: [
                    {
                        sender_uid: message.author,
                        amount: 1,
                        last_text: message.text
                    }
                ]
            })
        } else {
            // E se encontrou vau só alterar esses dois campos:
            inBox.senders_list[inBoxIndex].amount++;
            inBox.senders_list[inBoxIndex].last_text = message.text;

            await inBox.save()
                .catch((e) => console.error(e))
        }
    } else {
        await Chat_inBox.create({
            users_uid: receiver,
            senders_list: [
                {
                    sender_uid: message.author,
                    amount: 1,
                    last_text: message.text
                }
            ]
        }).catch((err) => console.error(err))
    }
}

module.exports = {cleanInBox, addInBox}