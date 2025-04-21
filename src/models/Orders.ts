import { Model, DataTypes } from 'sequelize';

//@ts-ignore
class Orders extends Model {
    //@ts-ignore
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

    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.belongsTo(models.Users, { foreignKey: 'payer_customer_uid', as: 'customer' });
    }
    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.belongsTo(models.Users, { foreignKey: 'provider_professional_uid', as: 'professional' });
    }
}

export default Orders;