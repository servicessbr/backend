"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//@ts-ignore
class Verifications extends sequelize_1.Model {
    //@ts-ignore
    static init(connection) {
        super.init({
            user_uid: sequelize_1.DataTypes.STRING,
            public_id: sequelize_1.DataTypes.STRING,
            sensitive_data: sequelize_1.DataTypes.STRING,
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
exports.default = Verifications;
