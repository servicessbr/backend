"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCache = exports.getCache = exports.setCache = void 0;
const environment_1 = __importDefault(require("../../configs/env/environment"));
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: environment_1.default });
//@ts-ignore
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});
const setCache = async (key, value, ex) => {
    return await redis.set(key, value, 'EX', ex
        ? ex
        : 30 * 60);
};
exports.setCache = setCache;
const getCache = async (key) => {
    return await redis.get(key);
};
exports.getCache = getCache;
const removeCache = async (key) => {
    return await redis.del(key);
};
exports.removeCache = removeCache;
