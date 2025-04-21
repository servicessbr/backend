import { Model, DataTypes } from 'sequelize';

//@ts-ignore
class Users extends Model {
    //@ts-ignore
    static init(connection) {
        super.init(
            {
                uid: DataTypes.STRING,
                password: DataTypes.STRING,
                name: DataTypes.STRING,
                email: DataTypes.STRING,
                phone: DataTypes.BIGINT,
                description: DataTypes.STRING,
                profession: DataTypes.STRING,
                blocked: DataTypes.BOOLEAN,
                pro: DataTypes.BOOLEAN,
                refreshtoken: DataTypes.STRING,
            },
            {
                sequelize: connection
            }
        );
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

export default Users;