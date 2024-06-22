import { MigrationInterface, QueryRunner } from 'typeorm';

export class FrequentCompositeIndex1719037577307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE INDEX "IDX_brand_years_engine" ON "product_entity" ("brand", "year_start_production", "year_end_production", "engine");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP INDEX "IDX_brand_years_engine";
        `);
  }
}
