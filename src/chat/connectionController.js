const { log } = require('console');

const connected = async (socket, connected_users) => {
    const { uid } = socket.request._query;

    if (!uid) return;

    /*connected_users[socket.id] = uid;*/
    connected_users[socket.id] = uid;

    log(`SOCKET REQUEST`, uid);
}

const disconnected = async (socket, connected_users) => {
    socket.on('disconnect', () => {
        log(`User Disconnected: ${socket.id}`);
        return delete connected_users[socket.id];
        /*return connected_users = connected_users.filter(item => item.id !== socket.id);*/
    })
}

/**
 *         const uid = socket.request._query.uid;

        if (!uid) return;

        connected_users[socket.id] = uid;

        log(`SOCKET REQUEST`, uid);
 * 
 */

module.exports = {connected, disconnected}