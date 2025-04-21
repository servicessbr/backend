const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require("cors");
import 'dotenv/config';

const http = require('http');
const { Server } = require('socket.io');

app.use(express.json());
app.use(cors());
app.use(routes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});


export default { server, io };