"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddColToCreateUser1623844670687 = void 0;
class AddColToCreateUser1623844670687 {
    async up(queryRunner) {
        queryRunner.query('ALTER TABLE user ADD password VARCHAR(30)');
    }
    async down(queryRunner) {
        queryRunner.dropColumn('user', 'password');
    }
}
exports.AddColToCreateUser1623844670687 = AddColToCreateUser1623844670687;
//# sourceMappingURL=1623844670687-AddColToCreateUser.js.map