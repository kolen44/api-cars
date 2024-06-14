import { MigrationInterface, QueryRunner } from 'typeorm';

export class ThirdMigration1718382596756 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "post_entity"
      ADD COLUMN "author" text DEFAULT NULL,
      ADD COLUMN "id_writer" integer DEFAULT 0,
      ADD COLUMN "timestamp" text DEFAULT '2024',
      ADD COLUMN "image_url" text DEFAULT NULL,
      ADD COLUMN "url_video" text DEFAULT NULL,
      ADD COLUMN "rating" text DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "post_entity"
      DROP COLUMN "author",
      DROP COLUMN "id_writer",
      DROP COLUMN "timestamp",
      DROP COLUMN "image_url",
      DROP COLUMN "url_video",
      DROP COLUMN "rating"
    `);
  }
}
