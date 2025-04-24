import { Model, DataTypes } from 'sequelize';


//@ts-ignore
class Internationals extends Model {
    //@ts-ignore
    static init(connection) {
        super.init(
            {
                work_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true
                },
                country: DataTypes.STRING,
                state: DataTypes.STRING,
                city: DataTypes.STRING,
            },
            {
                sequelize: connection
            }
        );
    }

    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.belongsTo(models.Users, { foreignKey: 'work_id', as: 'work' });
    }

}
export default Internationals;