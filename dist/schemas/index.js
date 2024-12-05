"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
const type_graphql_1 = require("type-graphql");
const UserResolver_1 = require("../resolvers/UserResolver");
// import { OrganizationResolver } from "../resolvers/OrganizationResolver";
const createSchema = () => {
    return (0, type_graphql_1.buildSchema)({
        resolvers: [UserResolver_1.UserResolver],
    });
};
exports.createSchema = createSchema;
