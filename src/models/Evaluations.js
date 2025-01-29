const { Model, DataTypes } = require('sequelize');

class Evaluations extends Model {
    static init(connection) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true
                },
                stars: DataTypes.SMALLINT,
                review_description: DataTypes.STRING,
                visible: DataTypes.BOOLEAN
            },
            {
                sequelize: connection
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Orders, { foreignKey: 'id', as: 'order' });
    }
}

module.exports = Evaluations;