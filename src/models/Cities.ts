import { Model, DataTypes } from 'sequelize';

//@ts-ignore
class Cities extends Model {
    //@ts-ignore
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING
            },
            {
                sequelize: connection
            }
        );
    }

    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.belongsTo(models.States, { foreignKey: 'state_id', as: 'state' });

        //@ts-ignore
        this.belongsTo(models.Works, { foreignKey: 'city_id', as: 'work' });

    }

}

export default Cities;