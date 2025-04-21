import { log } from 'console';
import { io } from './http';

/* 
    * Conntrollers
*/
import joinRoom from './chat/joinRoomController';
import leaveRoom from './chat/leaveRoomController';
import sendMessage from './chat/sendMessageController';
import chatList from './chat/chatListController';
import { connected, disconnected } from './chat/connectionController';

/* 
    * Mongo:
*/
import mongoose from 'mongoose';
process.env.MONGODB_PASSWORD && mongoose.connect(process.env.MONGODB_PASSWORD)
    .then(() => log('MongoDB connected w/ sucess!'))
    .catch(error => console.error('MongoDB fails to connect', error));

/* 
    * Authorization:
*/
import authio from './middlewares/auth/authio';
io.use(authio);

/* 
    * connected_users:
*/
const c = {};

io.on("connection", (s) => {
    connected(s, c)
    disconnected(s, c)

    joinRoom(s);
    leaveRoom(s);

    sendMessage(s, c);
    chatList(s);
});

