import Chat_inBox from '../schemas/Chat_inBox';

export const cleanInBox = async (author: any, receiver: any) => {
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

export const addInBox = async (receiver: any, message: any) => {
    //Adiciona esse user ao inBox e a ultima mensagem enviada:
    const inBox = await Chat_inBox.findOne({ users_uid: receiver });

    // Confirma se o receiver já tem ou não um InBox:
    if (inBox) {
        // Prucara no sender_list o uid de quem envio a mensagem:
        const inBoxIndex = inBox.senders_list.findIndex(((obj: any) => obj.sender_uid === message.author));

        // Se não encontrar vai fazer o primeiro push:
        if (inBoxIndex === -1) {
            inBox.senders_list.push({
                sender_uid: message.author,
                amount: 1,
                last_text: message.text
            })
            inBox.users_uid = receiver;
        } else {
            // E se encontrou vau só alterar esses dois campos:
            inBox.senders_list[inBoxIndex].amount++;
            inBox.senders_list[inBoxIndex].last_text = message.text;

            await inBox.save()
                .catch((e: Error) => console.error(e))
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
        }).catch((err: Error) => console.error(err))
    }
}
