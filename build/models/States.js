"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//@ts-ignore
class States extends sequelize_1.Model {
    //@ts-ignore
    static init(connection) {
        super.init({
            name: sequelize_1.DataTypes.STRING,
            initials: sequelize_1.DataTypes.STRING,
        }, {
            sequelize: connection
        });
    }
    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.hasMany(models.Cities, {
            foreignKey: 'state_id',
            as: 'city'
        });
    }
}
exports.default = States;
