const { Model, DataTypes } = require('sequelize');

class Subworks extends Model {
    static init(connection) {
        super.init(
            {
                work_id: DataTypes.INTEGER,
                title: DataTypes.STRING,
                description: DataTypes.STRING,
                price: DataTypes.REAL,
            },
            {
                sequelize: connection
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: 'work_id', as: 'work' });
    }

}
module.exports = Subworks;