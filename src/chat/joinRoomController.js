const { log } = require('console');
const Conversation = require("../schemas/Conversations");
const { cleanInBox } = require("./inBoxController");

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

                // Limpa o inbox dessa pessoa nessa conversa:
                const idx = conversation[0].users.indexOf(author);
                conversation[0].inBox[idx] = false;

                conversation[0].save()
                    .catch((e) => console.error(e))

                socket.join(conversation[0]._id.toString());

                socket.emit('conversation', conversation[0])
            } else {
                await Conversation.create({
                    users,
                    messages: []
                })
                    .then((conv) => {
                        log(`User with ID: ${socket.id} joined ROOM:${conv._id}`); //CHECK

                        socket.join(conv._id);
                        socket.emit('conversation', conv)
                    });
            }

            await cleanInBox(author, receiver);

        }
    )

module.exports = joinRoom;