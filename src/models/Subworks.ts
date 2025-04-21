import { Model, DataTypes } from 'sequelize';

//@ts-ignore
class Subworks extends Model {
    //@ts-ignore
    static init(connection) {
        super.init(
            {
                work_id: DataTypes.INTEGER,
                title: DataTypes.STRING,
                description: DataTypes.STRING,
                price: DataTypes.REAL,
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
export default Subworks;