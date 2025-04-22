import { Model } from 'sequelize';
declare class Works extends Model {
    static init(connection: any): void;
    static associate(models: any): void;
}
export default Works;
