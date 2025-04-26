import environment_variables from '../../public/json/local_env_variables.json';
import 'dotenv/config';

const isLocalEnv =()=>{
    return environment_variables.includes(`${process.env.NODE_ENV}`);
}

export default isLocalEnv;