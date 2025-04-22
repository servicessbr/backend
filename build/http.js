"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.default);
exports.server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: "*",
    }
});
