import { Model } from 'sequelize';
declare class Cities extends Model {
    static init(connection: any): void;
    static associate(models: any): void;
}
export default Cities;
