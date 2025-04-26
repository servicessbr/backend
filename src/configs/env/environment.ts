import 'dotenv/config';
import { log } from 'console';
import environment_variables from '../../../public/json/local_env_variables.json';

var environment = '.env';

switch (process.env.NODE_ENV) {
    case environment_variables[0]:
        environment = `.env.${environment_variables[0]}`
        break;
    case environment_variables[1]:
        environment = `.env.${environment_variables[1]}`
        break;
    case environment_variables[2]:
        environment = `.env.${environment_variables[2]}`
        break;

    default:
        break;
}

log('1) Environment: ', environment);

export default environment;