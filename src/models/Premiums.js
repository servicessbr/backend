const { Model, DataTypes } = require('sequelize');

class Premiums extends Model {
    static init(connection) {
        super.init(
            {
                user_uid: DataTypes.STRING,
                credit: DataTypes.SMALLINT,
                expiration: DataTypes.DATE,
                bank: DataTypes.SMALLINT,
                operation: DataTypes.INTEGER
            },
            {
                sequelize: connection
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: 'user_uid', as: 'user' });
    }

}

module.exports = Premiums;