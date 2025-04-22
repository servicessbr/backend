declare const _default: {
    dialect: string;
    host: string | undefined;
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    port: string | undefined;
    dialectOptions: {
        encrypt: boolean;
        ssl: {
            rejectUnauthorized: boolean;
        };
    };
    define: {
        underscored: boolean;
        timestamps: boolean;
    };
};
export default _default;
