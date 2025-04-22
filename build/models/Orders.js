"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//@ts-ignore
class Orders extends sequelize_1.Model {
    //@ts-ignore
    static init(connection) {
        super.init({
            provider_professional_uid: sequelize_1.DataTypes.STRING,
            payer_customer_uid: sequelize_1.DataTypes.STRING,
            execution_date: sequelize_1.DataTypes.DATE,
            transaction_amount: sequelize_1.DataTypes.REAL,
            original_subwork_title: sequelize_1.DataTypes.STRING,
            status: sequelize_1.DataTypes.STRING,
        }, {
            sequelize: connection
        });
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
exports.default = Orders;
