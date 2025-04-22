import { Model } from 'sequelize';
declare class Users extends Model {
    static init(connection: any): void;
    static associate(models: any): void;
}
export default Users;
