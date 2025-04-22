"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../env/environment"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: environment_1.default });
const console_1 = require("console");
(0, console_1.log)(environment_1.default, {
    host: process.env.PSQL_HOST,
    username: process.env.PSQL_USERNAME,
    database: process.env.PSQL_DATABASE,
});
exports.default = {
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
