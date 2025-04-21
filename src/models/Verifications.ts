import { Model, DataTypes } from 'sequelize';

//@ts-ignore
class Verifications extends Model {
    //@ts-ignore
    static init(connection) {
        super.init(
            {
                user_uid: DataTypes.STRING,
                public_id: DataTypes.STRING,
                sensitive_data: DataTypes.STRING,
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

export default Verifications;