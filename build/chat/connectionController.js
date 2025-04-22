"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnected = exports.connected = void 0;
const console_1 = require("console");
const connected = async (socket, connected_users) => {
    const { uid } = socket.request._query;
    if (!uid)
        return;
    /*connected_users[socket.id] = uid;*/
    connected_users[socket.id] = uid;
    (0, console_1.log)(`SOCKET REQUEST`, uid);
};
exports.connected = connected;
const disconnected = async (socket, connected_users) => {
    socket.on('disconnect', () => {
        (0, console_1.log)(`User Disconnected: ${socket.id}`);
        return delete connected_users[socket.id];
        /*return connected_users = connected_users.filter(item => item.id !== socket.id);*/
    });
};
exports.disconnected = disconnected;
/**
 *         const uid = socket.request._query.uid;

        if (!uid) return;

        connected_users[socket.id] = uid;

        log(`SOCKET REQUEST`, uid);
 *
 */
