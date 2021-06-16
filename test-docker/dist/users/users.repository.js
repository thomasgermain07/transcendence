"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const users_entity_1 = require("./users.entity");
const typeorm_1 = require("typeorm");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.createUser = async (userDto) => {
            return await this.save(userDto);
        };
        this.findOneUser = async (id) => {
            return this.findOneOrFail(id);
        };
        this.updateUser = async (id, userDto) => {
            return this.save(Object.assign(Object.assign({}, userDto), { id: Number(id) }));
        };
        this.removeUser = async (id) => {
            await this.findOneOrFail(id);
            return this.delete(id);
        };
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(users_entity_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=users.repository.js.map