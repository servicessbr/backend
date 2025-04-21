import { Model, DataTypes } from 'sequelize';

//@ts-ignore
class Premiums extends Model {
    //@ts-ignore
    static init(connection) {
        super.init(
            {
                user_uid: DataTypes.STRING,
                credit: DataTypes.SMALLINT,
                expiration: DataTypes.DATE,
                bank: DataTypes.SMALLINT,
                operation: DataTypes.INTEGER
            },
            {
                sequelize: connection
            }
        );
    }

    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.belongsTo(models.Users, { foreignKey: 'user_uid', as: 'user' });
    }

}

export default Premiums;