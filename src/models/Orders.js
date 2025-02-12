const { Model, DataTypes } = require('sequelize');

class Orders extends Model {
    static init(connection) {
        super.init(
            {
                provider_professional_uid: DataTypes.STRING,
                payer_customer_uid: DataTypes.STRING,
                execution_date: DataTypes.DATE,
                transaction_amount: DataTypes.REAL,
                original_subwork_title: DataTypes.STRING, 
                status: DataTypes.STRING,
            },
            {
                sequelize: connection
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: 'payer_customer_uid', as: 'customer' });
    }
    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: 'provider_professional_uid', as: 'professional' });
    }
}

module.exports = Orders;