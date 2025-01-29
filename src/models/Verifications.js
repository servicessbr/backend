const { Model, DataTypes } = require('sequelize');

class Verifications extends Model {
    static init(connection) {
        super.init(
            {
                user_uid: DataTypes.STRING,

                public_id: DataTypes.STRING,

                sensitive_data: DataTypes.STRING,
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

module.exports = Verifications;