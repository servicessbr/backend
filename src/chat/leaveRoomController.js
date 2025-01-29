const { log } = require('console');
const Conversation = require("../schemas/Conversations");

const leaveRoom = (socket) =>
    socket.on(
        'leaveRoom',

        async (author, receiver) => {

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

module.exports = leaveRoom;