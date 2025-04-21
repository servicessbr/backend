import environment from '../../configs/env/environment';

import Redis from 'ioredis';

import dotenv from 'dotenv';
dotenv.config({ path: environment });

//@ts-ignore
const redis = new Redis({
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

export const setCache = async (key: string, value: string, ex?: number) => {
    return await redis.set(
        key,
        value,
        'EX',
        ex
            ? ex
            : 30 * 60
    );
}

export const getCache = async (key: string) => {
    return await redis.get(key);
}
export const removeCache = async (key: string) => {
    return await redis.del(key);
}