const Sequelize = require('sequelize');
const dbConfig = require('../config/databaseConfig');

/*@ts-ignore*/
const connection = new Sequelize(dbConfig);

//Models
const Users = require('../models/Users');
const Cities = require('../models/Cities');
const States = require('../models/States');
const Works = require('../models/Works');
const Premiums = require('../models/Premiums');
const Verifications = require('../models/Verifications');
const Orders = require('../models/Orders')

Cities.init(connection);
States.init(connection);
Users.init(connection);
Works.init(connection);
Premiums.init(connection);
Verifications.init(connection);
Orders.init(connection);

Cities.associate(connection.models);
States.associate(connection.models);
Users.associate(connection.models);
Works.associate(connection.models);
Premiums.associate(connection.models);
Verifications.associate(connection.models);
Orders.associate(connection.models);

module.exports = connection;
