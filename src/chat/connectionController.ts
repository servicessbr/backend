import { log } from 'console';

export const connected = async (socket:any, connected_users:any) => {
    const { uid } = socket.request._query;

    if (!uid) return;

    /*connected_users[socket.id] = uid;*/
    connected_users[socket.id] = uid;

    log(`SOCKET REQUEST`, uid);
}

export const disconnected = async (socket:any, connected_users:any) => {
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
