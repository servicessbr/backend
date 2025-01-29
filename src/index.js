const { server } = require("./http");
require('./websocket');
const { log } = require('console');

const port = process.env.PORT || 8000;
server.listen(port, () => log(`App is on! | Port: ${port}`));
