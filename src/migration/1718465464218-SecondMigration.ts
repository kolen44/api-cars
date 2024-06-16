import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class SecondMigration1718465464218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'post_entity',
      new TableForeignKey({
        columnNames: ['user'],
        referencedColumnNames: ['telephone_number'],
        referencedTableName: 'user_entity',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('post_entity', 'telephone_number');
  }
}
