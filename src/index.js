const { log } = require('console');
const { server } = require("./http");
require('./websocket');

const port = process.env.PORT || 8000;

server.listen(port, () => log(
    `App is on! \nPort: ${port}`
));
