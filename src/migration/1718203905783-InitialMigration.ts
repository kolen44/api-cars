import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class InitialMigration1718203905783 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создаём таблицу post_entity, если её не существует
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "post_entity" (
        "id" SERIAL NOT NULL,
        "user_id" integer,
        "content" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_58e1080f8105e396d9a85fcf86c" PRIMARY KEY ("id")
      )`,
    );

    // Создаём таблицу user_entity, если её не существует
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user_entity" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "avatar_url" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )`,
    );

    // Изменение таблицы post_entity
    await queryRunner.query(
      `ALTER TABLE "post_entity" DROP CONSTRAINT IF EXISTS "FK_cc2b59f2109c123506cd2718c18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_entity" RENAME COLUMN "user_id" TO "telephone_number"`,
    );

    // Создание таблицы product_entity
    await queryRunner.query(
      `CREATE TABLE "product_entity" ("id" SERIAL NOT NULL, "id_writer" integer, "article" character varying, "in_stock" integer, "detail_name" character varying, "included_in_unit" character varying, "brand" character varying, "model" character varying, "version" character varying, "body_type" character varying, "year" integer, "engine" character varying, "volume" double precision, "engine_type" character varying, "gearbox" character varying, "original_number" character varying, "price" double precision, "for_naked" character varying, "currency" character varying, "description" character varying, "year_start_production" integer, "year_end_production" integer, "url_photo_details" character varying, "url_car_photo" character varying, "video" character varying, "phone" character varying, CONSTRAINT "PK_6e8f75045ddcd1c389c765c896e" PRIMARY KEY ("id"))`,
    );

    // Изменение таблицы user_entity
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP COLUMN "avatar_url"`,
    );
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "avatar_url" text`);
    await queryRunner.query(
      `ALTER TABLE "user_entity" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );

    // Добавление внешнего ключа в таблицу post_entity
    await queryRunner.createForeignKey(
      'post_entity',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user_entity',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_entity" DROP CONSTRAINT "FK_52cef99bc770c74d4a532612ac1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP COLUMN "avatar_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD "avatar_url" character varying`,
    );
    await queryRunner.query(`DROP TABLE "product_entity"`);
    await queryRunner.query(
      `ALTER TABLE "post_entity" RENAME COLUMN "telephone_number" TO "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_entity" ADD CONSTRAINT "FK_cc2b59f2109c123506cd2718c18" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
