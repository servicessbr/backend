"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//@ts-ignore
class Internationals extends sequelize_1.Model {
    //@ts-ignore
    static init(connection) {
        super.init({
            work_id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true
            },
            country: sequelize_1.DataTypes.STRING,
            state: sequelize_1.DataTypes.STRING,
            city: sequelize_1.DataTypes.STRING,
        }, {
            sequelize: connection
        });
    }
    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.belongsTo(models.Users, { foreignKey: 'work_id', as: 'work' });
    }
}
exports.default = Internationals;
