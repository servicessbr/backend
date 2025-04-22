import { Model } from 'sequelize';
declare class Subworks extends Model {
    static init(connection: any): void;
    static associate(models: any): void;
}
export default Subworks;
