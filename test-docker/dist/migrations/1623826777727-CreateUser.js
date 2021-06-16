"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser1623826777727 = void 0;
const typeorm_1 = require("typeorm");
class CreateUser1623826777727 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'user',
            columns: [
                {
                    name: 'id',
                    type: 'int4',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                    length: '50',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isNullable: false,
                    length: '150',
                },
            ],
        }), false);
    }
    async down(queryRunner) {
        queryRunner.query('DROP TABLE user');
    }
}
exports.CreateUser1623826777727 = CreateUser1623826777727;
//# sourceMappingURL=1623826777727-CreateUser.js.map