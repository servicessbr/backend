const { Model, DataTypes } = require('sequelize');

class Works extends Model {
    static init(connection) {
        super.init(
            {
                user_uid: DataTypes.STRING,

                title: DataTypes.STRING,
                description: DataTypes.STRING,
                remote: DataTypes.BOOLEAN,
                price: DataTypes.REAL,
                discount: DataTypes.SMALLINT,
                per: DataTypes.STRING,

                details: DataTypes.STRING,
                availability: DataTypes.STRING,
                hours: DataTypes.STRING,

                city_id: DataTypes.INTEGER,
                district: DataTypes.STRING,
                address: DataTypes.STRING,
                number: DataTypes.INTEGER,

                socialmedia: DataTypes.STRING,
                checklist: DataTypes.STRING,

                banner: DataTypes.STRING,

                standby: DataTypes.BOOLEAN
            },
            {
                sequelize: connection
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: 'user_uid', as: 'user' });

        this.hasOne(models.Cities, {
            foreignKey: 'city_id',
            as: 'city'
        });

        this.hasMany(models.Subworks, {
            foreignKey: 'work_id',
            as: 'subworks'
        });
    }

}
module.exports = Works;