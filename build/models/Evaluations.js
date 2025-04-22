"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//@ts-ignore
class Evaluations extends sequelize_1.Model {
    //@ts-ignore
    static init(connection) {
        super.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true
            },
            stars: sequelize_1.DataTypes.SMALLINT,
            review_description: sequelize_1.DataTypes.STRING,
            visible: sequelize_1.DataTypes.BOOLEAN
        }, {
            sequelize: connection
        });
    }
    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.belongsTo(models.Orders, { foreignKey: 'id', as: 'order' });
    }
}
exports.default = Evaluations;
