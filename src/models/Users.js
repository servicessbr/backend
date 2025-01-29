const { Model, DataTypes } = require('sequelize');

class Users extends Model {
    static init(connection) {
        super.init(
            {
                uid: DataTypes.STRING,
                password: DataTypes.STRING,
                name: DataTypes.STRING,
                email: DataTypes.STRING,
                phone: DataTypes.BIGINT,
                description: DataTypes.STRING,
                profession: DataTypes.STRING,
                avatar: DataTypes.STRING,

                partner: DataTypes.BOOLEAN,
                verified: DataTypes.BOOLEAN,
                blocked: DataTypes.BOOLEAN,

                refreshtoken: DataTypes.STRING,
            },
            {
                sequelize: connection
            }
        );
    }

    static associate(models) {
        this.hasMany(models.Works, {
            foreignKey: 'user_uid',
            as: 'work'
        });
    }

}

module.exports = Users;