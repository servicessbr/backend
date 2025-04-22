import { Model } from 'sequelize';
declare class Evaluations extends Model {
    static init(connection: any): void;
    static associate(models: any): void;
}
export default Evaluations;
