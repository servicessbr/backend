"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//@ts-ignore
class Works extends sequelize_1.Model {
    //@ts-ignore
    static init(connection) {
        super.init({
            user_uid: sequelize_1.DataTypes.STRING,
            title: sequelize_1.DataTypes.STRING,
            description: sequelize_1.DataTypes.STRING,
            remote: sequelize_1.DataTypes.BOOLEAN,
            price: sequelize_1.DataTypes.REAL,
            discount: sequelize_1.DataTypes.SMALLINT,
            per: sequelize_1.DataTypes.STRING,
            details: sequelize_1.DataTypes.STRING,
            availability: sequelize_1.DataTypes.STRING,
            hours: sequelize_1.DataTypes.STRING,
            city_id: sequelize_1.DataTypes.INTEGER,
            district: sequelize_1.DataTypes.STRING,
            address: sequelize_1.DataTypes.STRING,
            number: sequelize_1.DataTypes.INTEGER,
            socialmedia: sequelize_1.DataTypes.STRING,
            checklist: sequelize_1.DataTypes.STRING,
            banner: sequelize_1.DataTypes.STRING,
            standby: sequelize_1.DataTypes.BOOLEAN
        }, {
            sequelize: connection
        });
    }
    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.belongsTo(models.Users, { foreignKey: 'user_uid', as: 'user' });
        //@ts-ignore
        this.hasOne(models.Cities, {
            foreignKey: 'city_id',
            as: 'city'
        });
        //@ts-ignore
        this.hasMany(models.Subworks, {
            foreignKey: 'work_id',
            as: 'subworks'
        });
    }
}
exports.default = Works;
