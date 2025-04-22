import { Model } from 'sequelize';
declare class Premiums extends Model {
    static init(connection: any): void;
    static associate(models: any): void;
}
export default Premiums;
