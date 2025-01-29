
const Conversation = require('../../schemas/Conversations');

// Functions:
const handleChatList = require('../../functions/chatList');
const Chat_inBox = require('../../schemas/Chat_inBox');

const chatList = (socket) =>
    socket.on(
        'chatList',
        async (uid) => {
            const inBox = await Chat_inBox.findOne({ users_uid: uid });

            const conversation = await Conversation.find({ users: { $all: uid } });

            const list = [];
            conversation.map((it) => {
                const idx = it.users.indexOf(uid);
                /*@ts-ignore*/
                if (it.messages.length) list.push({
                    receiver: idx === 0 ? it.users[1] : it.users[0],
                    inBox: it.inBox[idx]
                })
            })

            handleChatList(list).then((newList) => {
                socket.emit('loadList', { list: newList, inBox });
                //socket.to(socket.id).emit('loadList', newList);
            })
        }
    );

module.exports = chatList;