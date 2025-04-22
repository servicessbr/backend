"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const databaseConfig_1 = __importDefault(require("../../configs/sequelize/databaseConfig"));
//@ts-ignore
const connection = new sequelize_1.default(databaseConfig_1.default);
/*
    * Models
*/
const Users_1 = __importDefault(require("../Users"));
const Cities_1 = __importDefault(require("../Cities"));
const States_1 = __importDefault(require("../States"));
const Works_1 = __importDefault(require("../Works"));
const Premiums_1 = __importDefault(require("../Premiums"));
const Verifications_1 = __importDefault(require("../Verifications"));
const Orders_1 = __importDefault(require("../Orders"));
const Subworks_1 = __importDefault(require("../Subworks"));
const Evaluations_1 = __importDefault(require("../Evaluations"));
Cities_1.default.init(connection);
States_1.default.init(connection);
Users_1.default.init(connection);
Works_1.default.init(connection);
Subworks_1.default.init(connection);
Premiums_1.default.init(connection);
Verifications_1.default.init(connection);
Orders_1.default.init(connection);
Evaluations_1.default.init(connection);
Cities_1.default.associate(connection.models);
States_1.default.associate(connection.models);
Users_1.default.associate(connection.models);
Works_1.default.associate(connection.models);
Subworks_1.default.associate(connection.models);
Premiums_1.default.associate(connection.models);
Verifications_1.default.associate(connection.models);
Orders_1.default.associate(connection.models);
Evaluations_1.default.associate(connection.models);
exports.default = connection;
