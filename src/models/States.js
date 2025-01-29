const { Model, DataTypes } = require('sequelize');

class States extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
                initials: DataTypes.STRING,
            },
            {
                sequelize: connection
            }
        );
    }

    static associate(models) {
        this.hasMany(models.Cities, {
            foreignKey: 'state_id',
            as: 'city'
        });
    }
}

module.exports = States;