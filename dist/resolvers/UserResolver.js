"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
// src/resolvers/UserResolver.ts
const type_graphql_1 = require("type-graphql");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const Organization_1 = require("../entities/Organization");
const cognito_1 = require("../utils/cognito");
let UserResolver = class UserResolver {
    signUp(firstName, lastName, email, phone, role, password, status, organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const organization = yield data_source_1.AppDataSource.getRepository(Organization_1.Organization).findOne({ where: { id: organizationId } });
            if (!organization)
                throw new Error('Organization not found');
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const cognitoUser = yield (0, cognito_1.signUpUser)(email, password);
            const user = new User_1.User();
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.phone = phone;
            user.role = role;
            user.status = status;
            user.password = password;
            user.organizationId = organization;
            yield data_source_1.AppDataSource.getRepository(User_1.User).save(user);
            return `User created successfully.`;
        });
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('firstName')),
    __param(1, (0, type_graphql_1.Arg)('lastName')),
    __param(2, (0, type_graphql_1.Arg)('email')),
    __param(3, (0, type_graphql_1.Arg)('phone')),
    __param(4, (0, type_graphql_1.Arg)('role')),
    __param(5, (0, type_graphql_1.Arg)('password')),
    __param(6, (0, type_graphql_1.Arg)('status')),
    __param(7, (0, type_graphql_1.Arg)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signUp", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(User_1.User)
], UserResolver);
