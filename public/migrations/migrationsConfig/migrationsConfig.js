const { log } = require('console');
require('dotenv').config({ path: '.env.sequelize.migrations' })

log(
    {
        host: process.env.PSQL_HOST,
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
