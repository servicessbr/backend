const { log } = require('console');
const Conversation = require("../../schemas/Conversations");
const { cleanInBox } = require("../controllers/inBoxController");

const joinRoom = (socket) =>
    socket.on(
        'joinRoom',

        async (author, receiver, access) => {
            const users = [author, receiver];

            if (!Array.isArray(users)) return;
            if (users.length !== 2) return;

            let conversation = await Conversation.find({ users: { $all: users } });

            if (Conversation.length && conversation[0] && conversation[0]._id) {
                log(`User with ID: ${socket.id} joined ROOM:${conversation[0]._id}`); //CHECK

                // Limpa o in box dessa pessoa nessa conversa:
                const idx = conversation[0].users.indexOf(author);
                conversation[0].inBox[idx] = false;

                conversation[0].save()
                    .catch((e) => console.error(e))

                socket.join(conversation[0]._id.toString());
                //socket.emit('roomId', conversation[0]._id);
                //socket.emit('previousMessages', conversation[0]);
                socket.emit('conversation', conversation[0])
            } else {
                // Toda vez que criar uma nova conversa deve conferir se o Premium Credit:

                await Conversation.create({
                    users,
                    messages: []
                })
                    .then((conv) => {
                        log(`User with ID: ${socket.id} joined ROOM:${conv._id}`); //CHECK

                        socket.join(conv._id);
                        socket.emit('conversation', conv)
                        //socket.emit('roomId', c._id);
                        //socket.emit('previousMessages', c);
                    });
            }

            await cleanInBox(author, receiver);

        }
    )

module.exports = joinRoom;