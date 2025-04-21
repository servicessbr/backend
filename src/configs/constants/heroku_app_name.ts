import { URL_HEROKU_SERVER } from './URL';

import 'dotenv/config';

const HEROKU_APP_NAME =
    process.env.HEROKU_APP_NAME
        ? process.env.HEROKU_APP_NAME
        : URL_HEROKU_SERVER;

export default HEROKU_APP_NAME;        