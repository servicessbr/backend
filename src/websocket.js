import { log } from 'console';
const { io } = require('./http');

/* 
    * Conntrollers
*/
const joinRoom = require('./chat/joinRoomController');
const leaveRoom = require('./chat/leaveRoomController');
const sendMessage = require('./chat/sendMessageController');
const chatList = require('./chat/chatListController');
const { connected, disconnected } = require('./chat/connectionController');

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
const authio = require('./middlewares/auth/authio');
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

