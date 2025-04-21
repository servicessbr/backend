import { log } from 'console';
import { server } from "./http";
import './websocket';

const port = process.env.PORT || 8000;

server.listen(port, () => log(
    `App is on! \nPort: ${port}`
));
