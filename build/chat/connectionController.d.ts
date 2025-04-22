export declare const connected: (socket: any, connected_users: any) => Promise<void>;
export declare const disconnected: (socket: any, connected_users: any) => Promise<void>;
/**
 *         const uid = socket.request._query.uid;

        if (!uid) return;

        connected_users[socket.id] = uid;

        log(`SOCKET REQUEST`, uid);
 *
 */
