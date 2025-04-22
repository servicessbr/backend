import { Model } from 'sequelize';
declare class Orders extends Model {
    static init(connection: any): void;
    static associate(models: any): void;
}
export default Orders;
