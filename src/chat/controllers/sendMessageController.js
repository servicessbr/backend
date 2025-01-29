const lazyPush = require("../../helpers/pushNotifications");
const Chat_Channel = require("../../schemas/Chat_Channel");
const Conversation = require("../../schemas/Conversations");
const { addInBox } = require("../controllers/inBoxController");

const sendMessage = (socket, connected_users) =>
    socket.on(
        'sendMessage',
        async (room, message, access) => {
            if (typeof room !== 'string') return;
            if (room.length !== 24) return;

            const conversation = await Conversation.findOne({ _id: room });

            if (!conversation) return;

            const receiver = conversation.users.filter(r => r !== message.author)[0];

            // Encontra o ExpoPushToken de quem vai recer a notificação:
            const channel = await Chat_Channel.findOne({ uid: receiver });

            // Confirma se o usuáro que vai receber a notificação(pelo uid) está online ou não:
            // Esse estará online caso esteja na varial c.
            const isOnline = Boolean(
                Object.keys(connected_users).find(key => connected_users[key] === receiver)
            );

            conversation.messages.push(message);

            // Limpa o in box dessa pessoa nessa conversa:
            const idx = conversation.users.indexOf(message.author);


            conversation.save()
                .catch((e) => console.error(e))

            socket.to(room).emit('receivedMessage', message);

            // Se o receiver tiver online acaba aqui:
            if (isOnline) return;

            await addInBox(receiver, message);

            if (!channel) return;
            //Executa a notifição:
            return lazyPush([
                {
                    to: channel.ExponentPushToken,
                    sound: 'default',
                    body: message.text.substring(0, 19),
                    data: {},
                }
            ])


        }
    )


module.exports = sendMessage;