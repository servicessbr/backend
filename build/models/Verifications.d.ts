import { Model } from 'sequelize';
declare class Verifications extends Model {
    static init(connection: any): void;
    static associate(models: any): void;
}
export default Verifications;
