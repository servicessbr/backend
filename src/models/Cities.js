const { Model, DataTypes } = require('sequelize');

class Cities extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING
            },
            {
                sequelize: connection
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.States, { foreignKey: 'state_id', as: 'state' });

        this.belongsTo(models.Works, { foreignKey: 'city_id', as: 'work' });

    }

}

module.exports = Cities;