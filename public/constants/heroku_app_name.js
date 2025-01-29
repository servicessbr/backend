require('dotenv').config();

const HEROKU_APP_NAME =
    process.env.HEROKU_APP_NAME
        ? process.env.HEROKU_APP_NAME
        : 'https://servicess-04d4b6080f33.herokuapp.com';

module.exports = HEROKU_APP_NAME;        