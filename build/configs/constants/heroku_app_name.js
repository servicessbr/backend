"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const URL_1 = require("./URL");
require("dotenv/config");
const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME
    ? process.env.HEROKU_APP_NAME
    : URL_1.URL_HEROKU_SERVER;
exports.default = HEROKU_APP_NAME;
