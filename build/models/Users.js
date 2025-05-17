"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//@ts-ignore
class Users extends sequelize_1.Model {
    //@ts-ignore
    static init(connection) {
        super.init({
            uid: sequelize_1.DataTypes.STRING,
            password: sequelize_1.DataTypes.STRING,
            name: sequelize_1.DataTypes.STRING,
            email: sequelize_1.DataTypes.STRING,
            phone: sequelize_1.DataTypes.BIGINT,
            description: sequelize_1.DataTypes.STRING,
            profession: sequelize_1.DataTypes.STRING,
            blocked: sequelize_1.DataTypes.BOOLEAN,
            pro: sequelize_1.DataTypes.DATE,
            vip: sequelize_1.DataTypes.DATE,
            refreshtoken: sequelize_1.DataTypes.STRING,
        }, {
            sequelize: connection
        });
    }
    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.hasMany(models.Works, {
            foreignKey: 'user_uid',
            as: 'work'
        });
    }
}
exports.default = Users;
