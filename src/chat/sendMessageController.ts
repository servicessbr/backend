import lazyPush from "../mobile/pushNotifications";
import Chat_Channel from "../schemas/Chat_Channel";
import Conversation from "../schemas/Conversations";
import { addInBox } from "./inBoxController";

const sendMessage = (socket: any, connected_users: any) =>
    socket.on(
        'sendMessage',
        async (room: any, message: any, access: any) => {
            if (typeof room !== 'string') return;
            if (room.length !== 24) return;

            const conversation = await Conversation.findOne({ _id: room });

            if (!conversation) return;

            const receiver = conversation.users.filter((r: any) => r !== message.author)[0];

            /* 
                * Encontra o ExpoPushToken de quem vai recer a notificação: 
            */
            const channel = await Chat_Channel.findOne({ uid: receiver });

            /* 
                * Confirma se o usuáro que vai receber a notificação(pelo uid) está online ou não:
                * Esse estará online caso esteja na varial c.
            */
            const isOnline = Boolean(
                Object.keys(connected_users).find(key => connected_users[key] === receiver)
            );

            conversation.messages.push(message);

            /* 
                * Limpa o in box dessa pessoa nessa conversa:
            */
            const idx = conversation.users.indexOf(message.author);


            conversation.save()
                .catch((e: Error) => console.error(e))

            socket.to(room).emit('receivedMessage', message);

            /*
                * Se o receiver tiver online acaba aqui:
            */
            if (isOnline) return;

            await addInBox(receiver, message);

            if (!channel) return;
            /*
                * Executa a notifição:
            */
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


export default sendMessage;