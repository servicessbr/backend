"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const local_env_variables_json_1 = __importDefault(require("../../public/json/local_env_variables.json"));
require("dotenv/config");
const isLocalEnv = () => {
    return local_env_variables_json_1.default.includes(`${process.env.NODE_ENV}`);
};
exports.default = isLocalEnv;
