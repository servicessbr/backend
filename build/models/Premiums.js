"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//@ts-ignore
class Premiums extends sequelize_1.Model {
    //@ts-ignore
    static init(connection) {
        super.init({
            user_uid: sequelize_1.DataTypes.STRING,
            credit: sequelize_1.DataTypes.SMALLINT,
            expiration: sequelize_1.DataTypes.DATE,
            bank: sequelize_1.DataTypes.SMALLINT,
            operation: sequelize_1.DataTypes.INTEGER
        }, {
            sequelize: connection
        });
    }
    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.belongsTo(models.Users, { foreignKey: 'user_uid', as: 'user' });
    }
}
exports.default = Premiums;
