import { log } from 'console';
import Conversation from "../schemas/Conversations";

const leaveRoom = (socket:any) =>
    socket.on(
        'leaveRoom',

        async (author:any, receiver:any) => {

            const users = [author, receiver];

            if (!Array.isArray(users)) return;
            if (users.length !== 2) return;

            let conversation = await Conversation.find({ users: { $all: users } });

            if (Conversation.length && conversation[0] && conversation[0]._id) {
                log(`User with ID: ${socket.id} leaved ROOM:${conversation[0]._id}`); //CHECK
                socket.leave(conversation[0]._id.toString());
            }

        }
    )

export default leaveRoom;