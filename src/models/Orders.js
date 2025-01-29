const { Model, DataTypes } = require('sequelize');

class Orders extends Model {
    static init(connection) {
        super.init(
            {
                so_unique_id:DataTypes.STRING,
                client_uid: DataTypes.STRING,
                prof_uid: DataTypes.STRING,
                work_ref: DataTypes.INTEGER,
                status: DataTypes.STRING,
                price: DataTypes.REAL,
                paid: DataTypes.BOOLEAN,
                ser_description: DataTypes.STRING,
                ser_response: DataTypes.STRING,
                loc_place: DataTypes.STRING,
                loc_location: DataTypes.STRING,
                date_hours: DataTypes.STRING,
                date_month: DataTypes.STRING,
                date_day: DataTypes.INTEGER,
                date_week: DataTypes.STRING,
                finished: DataTypes.BOOLEAN,
                pix: DataTypes.STRING
            },
            {
                sequelize: connection
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: 'client_uid', as: 'client' });
    }
    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: 'prof_uid', as: 'prof' });
    }
    static associate(models) {
        this.belongsTo(models.Works, { foreignKey: 'work_ref', as: 'work' });
    }

}

module.exports = Orders;