const { log } = require('console');
const { io } = require('./http');

// Conntrollers
const joinRoom = require('./chat/controllers/joinRoomController');
const leaveRoom = require('./chat/controllers/leaveRoomController');
const sendMessage = require('./chat/controllers/sendMessageController');
const chatList = require('./chat/controllers/chatListController');
const { connected, disconnected } = require('./chat/controllers/connectionController');

// Mongo:
const mongoose = require('mongoose');
process.env.MONGODB_PASSWORD && mongoose.connect(process.env.MONGODB_PASSWORD)
    .then(() => log('MongoDB connected w/ sucess!'))
    .catch(error => console.error('MongoDB fails to connect', error));

// Authorization:
const authio = require('./middlewares/authio');
io.use(authio);

// connected_users:
const c = {};

io.on("connection", (s) => {
    connected(s, c)
    disconnected(s, c)

    joinRoom(s);
    leaveRoom(s);

    sendMessage(s, c);
    chatList(s);
});

