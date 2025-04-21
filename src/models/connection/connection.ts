import Sequelize from 'sequelize';
import dbConfig from '../../configs/sequelize/databaseConfig';

//@ts-ignore
const connection = new Sequelize(dbConfig);

/*
    * Models
*/
import Users from '../Users';
import Cities from '../Cities';
import States from '../States';
import Works from '../Works';
import Premiums from '../Premiums'
import Verifications from '../Verifications';
import Orders from '../Orders';
import Subworks from '../Subworks';
import Evaluations from '../Evaluations';

Cities.init(connection);
States.init(connection);
Users.init(connection);
Works.init(connection);
Subworks.init(connection);
Premiums.init(connection);
Verifications.init(connection);
Orders.init(connection);
Evaluations.init(connection);

Cities.associate(connection.models);
States.associate(connection.models);
Users.associate(connection.models);
Works.associate(connection.models);
Subworks.associate(connection.models);
Premiums.associate(connection.models);
Verifications.associate(connection.models);
Orders.associate(connection.models);
Evaluations.associate(connection.models);

export default connection;