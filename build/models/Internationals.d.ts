import { Model } from 'sequelize';
declare class Internationals extends Model {
    static init(connection: any): void;
    static associate(models: any): void;
}
export default Internationals;
