import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColToCreateUser1623844670687 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        queryRunner.query('ALTER TABLE user ADD password VARCHAR(30)');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner.dropColumn('user', 'password');
    }

}
