import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesToProductEntity1718754466813
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE INDEX idx_article ON product_entity(article);
          CREATE INDEX idx_detail_name ON product_entity(detail_name);
          CREATE INDEX idx_brand ON product_entity(brand);
          CREATE INDEX idx_model ON product_entity(model);
          CREATE INDEX idx_version ON product_entity(version);
          CREATE INDEX idx_body_type ON product_entity(body_type);
          CREATE INDEX idx_year ON product_entity(year);
          CREATE INDEX idx_engine ON product_entity(engine);
          CREATE INDEX idx_volume ON product_entity(volume);
          CREATE INDEX idx_engine_type ON product_entity(engine_type);
          CREATE INDEX idx_gearbox ON product_entity(gearbox);
          CREATE INDEX idx_original_number ON product_entity(original_number);
          CREATE INDEX idx_year_start_production ON product_entity(year_start_production);
          CREATE INDEX idx_year_end_production ON product_entity(year_end_production);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP INDEX idx_article;
          DROP INDEX idx_detail_name;
          DROP INDEX idx_brand;
          DROP INDEX idx_model;
          DROP INDEX idx_version;
          DROP INDEX idx_body_type;
          DROP INDEX idx_year;
          DROP INDEX idx_engine;
          DROP INDEX idx_volume;
          DROP INDEX idx_engine_type;
          DROP INDEX idx_gearbox;
          DROP INDEX idx_original_number;
          DROP INDEX idx_year_start_production;
          DROP INDEX idx_year_end_production;
        `);
  }
}
