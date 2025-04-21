const { URL_HEROKU_SERVER } = require('./URL');

import 'dotenv/config';

const HEROKU_APP_NAME =
    process.env.HEROKU_APP_NAME
        ? process.env.HEROKU_APP_NAME
        : URL_HEROKU_SERVER;

module.exports = HEROKU_APP_NAME;        