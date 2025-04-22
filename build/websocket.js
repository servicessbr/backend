"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const http_1 = require("./http");
/*
    * Conntrollers
*/
const joinRoomController_1 = __importDefault(require("./chat/joinRoomController"));
const leaveRoomController_1 = __importDefault(require("./chat/leaveRoomController"));
const sendMessageController_1 = __importDefault(require("./chat/sendMessageController"));
const chatListController_1 = __importDefault(require("./chat/chatListController"));
const connectionController_1 = require("./chat/connectionController");
/*
    * Mongo:
*/
const mongoose_1 = __importDefault(require("mongoose"));
process.env.MONGODB_PASSWORD && mongoose_1.default.connect(process.env.MONGODB_PASSWORD)
    .then(() => (0, console_1.log)('MongoDB connected w/ sucess!'))
    .catch(error => console.error('MongoDB fails to connect', error));
/*
    * Authorization:
*/
const authio_1 = __importDefault(require("./middlewares/auth/authio"));
http_1.io.use(authio_1.default);
/*
    * connected_users:
*/
const c = {};
http_1.io.on("connection", (s) => {
    (0, connectionController_1.connected)(s, c);
    (0, connectionController_1.disconnected)(s, c);
    (0, joinRoomController_1.default)(s);
    (0, leaveRoomController_1.default)(s);
    (0, sendMessageController_1.default)(s, c);
    (0, chatListController_1.default)(s);
});
