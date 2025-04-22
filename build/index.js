"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const http_1 = require("./http");
require("./websocket");
const port = process.env.PORT || 8000;
http_1.server.listen(port, () => (0, console_1.log)(`App is on! \nPort: ${port}`));
