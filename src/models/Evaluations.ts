import { Model, DataTypes } from 'sequelize';

//@ts-ignore
class Evaluations extends Model {
    //@ts-ignore
    static init(connection) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true
                },
                stars: DataTypes.SMALLINT,
                review_description: DataTypes.STRING,
                visible: DataTypes.BOOLEAN
            },
            {
                sequelize: connection
            }
        );
    }

    //@ts-ignore
    static associate(models) {
        //@ts-ignore
        this.belongsTo(models.Orders, { foreignKey: 'id', as: 'order' });
    }
}

export default Evaluations;