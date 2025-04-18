const environment = require('../env/environment');
require('dotenv').config({path: environment});

const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});


const setCache = async (key, value, ex) => {
    return await redis.set(
        key,
        value,
        'ex',
        ex
            ? ex
            : 30 * 60
    );
}

const getCache = async (key) => {
    return await redis.get(key);
}

module.exports = { setCache, getCache }