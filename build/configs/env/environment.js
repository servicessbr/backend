"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const console_1 = require("console");
const local_env_variables_json_1 = __importDefault(require("../../../public/json/local_env_variables.json"));
var environment = '.env';
switch (process.env.NODE_ENV) {
    case local_env_variables_json_1.default[0]:
        environment = `.env.${local_env_variables_json_1.default[0]}`;
        break;
    case local_env_variables_json_1.default[1]:
        environment = `.env.${local_env_variables_json_1.default[1]}`;
        break;
    case local_env_variables_json_1.default[2]:
        environment = `.env.${local_env_variables_json_1.default[2]}`;
        break;
    default:
        break;
}
(0, console_1.log)('1) Environment: ', environment);
exports.default = environment;
