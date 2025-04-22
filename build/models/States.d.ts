import { Model } from 'sequelize';
declare class States extends Model {
    static init(connection: any): void;
    static associate(models: any): void;
}
export default States;
