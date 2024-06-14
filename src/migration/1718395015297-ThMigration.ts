import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class ThMigration1718395015297 implements MigrationInterface {
  private foreignKey = new TableForeignKey({
    columnNames: ['posts'],
    referencedColumnNames: ['user'],
    referencedTableName: 'user_entity',
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey('post_entity', this.foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('post_entity', this.foreignKey);
  }
}
