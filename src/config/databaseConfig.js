require('dotenv').config();

module.exports = {
    dialect: 'postgres',

    /* DEVELOPMENT */
    /*
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'stage',
    */

    /* PRODUTION */
    host: process.env.PSQL_HOST,
    username: process.env.PSQL_USERNAME,
    password: process.env.PSQL_PASSWORD,
    database: process.env.PSQL_DATABASE,
    

    port: process.env.PSQL_PORT,
    dialectOptions: {
        encrypt: true,
        ssl: {
            rejectUnauthorized: false
        }
    },

    define: {
        underscored: true, /* snake_case instead PascalCase. */
        timestamps: true /* created_at, updated_at serão gerados automaticamente. */
    }
};
