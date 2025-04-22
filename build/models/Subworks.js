"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//@ts-ignore
class Subworks extends sequelize_1.Model {
    //@ts-ignore
    static init(connection) {
        super.init({
            work_id: sequelize_1.DataTypes.INTEGER,
            title: sequelize_1.DataTypes.STRING,
            description: sequelize_1.DataTypes.STRING,
            price: sequelize_1.DataTypes.REAL,
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
exports.default = Subworks;
