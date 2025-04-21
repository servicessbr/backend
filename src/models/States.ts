import { Model, DataTypes } from 'sequelize';

//@ts-ignore
class States extends Model {
    //@ts-ignore
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
                initials: DataTypes.STRING,
            },
            {
                sequelize: connection
            }
        );
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

export default States;