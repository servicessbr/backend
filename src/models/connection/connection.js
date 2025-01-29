const Sequelize = require('sequelize')
const dbConfig = require('../../../public/config/databaseConfig')

const connection = new Sequelize(dbConfig)

/*
    * Models
*/
const Users = require('../Users')
const Cities = require('../Cities')
const States = require('../States')
const Works = require('../Works')
const Premiums = require('../Premiums')
const Verifications = require('../Verifications')
const Orders = require('../Orders')
const Subworks = require('../Subworks')

Cities.init(connection)
States.init(connection)
Users.init(connection)
Works.init(connection)
Subworks.init(connection)
Premiums.init(connection)
Verifications.init(connection)
Orders.init(connection)

Cities.associate(connection.models)
States.associate(connection.models)
Users.associate(connection.models)
Works.associate(connection.models)
Subworks.associate(connection.models)
Premiums.associate(connection.models)
Verifications.associate(connection.models)
Orders.associate(connection.models)

module.exports = connection