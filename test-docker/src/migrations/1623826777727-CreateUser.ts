import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUser1623826777727 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
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
            }),
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner.query('DROP TABLE user');
    }

}
