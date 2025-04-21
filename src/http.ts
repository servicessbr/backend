import express from 'express';
const app = express();
import routes from './routes';
import cors from "cors";
import 'dotenv/config';

import http from 'http';
import { Server } from 'socket.io';

app.use(express.json());
app.use(cors());
app.use(routes);

export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",
    }
});


