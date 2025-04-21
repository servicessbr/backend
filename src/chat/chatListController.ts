
import Conversation from '../schemas/Conversations';

/* 
    * Functions:
*/
import handleChatList from '../functions/chatList';
import Chat_inBox from '../schemas/Chat_inBox';

const chatList = (socket:any) =>
    socket.on(
        'chatList',
        async (uid:any) => {
            const inBox = await Chat_inBox.findOne({ users_uid: uid });

            const conversation = await Conversation.find({ users: { $all: uid } });

            const list:Array<any> = [];
            conversation.map((it) => {
                const idx = it.users.indexOf(uid);
                 
                if (it.messages.length) list.push({
                    receiver: idx === 0 ? it.users[1] : it.users[0],
                    inBox: it.inBox[idx]
                })
            })

            handleChatList(list).then((newList:any) => {
                socket.emit('loadList', { list: newList, inBox });
                //socket.to(socket.id).emit('loadList', newList);
            })
        }
    );

export default chatList;