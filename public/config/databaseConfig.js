const environment = require('../env/environment');
require('dotenv').config({ path: environment });
const { log } = require('console')

log(
    environment,
    {
        host: process.env.PSQL_HOST,
        username: process.env.PSQL_USERNAME,
        database: process.env.PSQL_DATABASE,
    }
)

module.exports = {
    dialect: 'postgres',

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
