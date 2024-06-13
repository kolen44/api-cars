import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class InitialMigration1718203905783 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_entity',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'telephone_number',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'fio',
            type: 'varchar',
          },
          {
            name: 'tg_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'site_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'company_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'payments',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'avatar_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'activity',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'password_updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    //Создание новой сущности
    await queryRunner.createTable(
      new Table({
        name: 'token_entity',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'token',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'post_entity',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'id_writer',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'author',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'timestamp',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'content',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'url_video',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'rating',
            type: 'integer',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'card_product',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id_writer',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'article',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'in_stock',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'detail_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'included_in_unit',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'brand',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'model',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'body_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'year',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'engine',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'volume',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'engine_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'gearbox',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'original_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'double precision',
            isNullable: true,
          },
          {
            name: 'for_naked',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'year_start_production',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'year_end_production',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'url_photo_details',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'url_car_photo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'video',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user_entity',
      new TableForeignKey({
        columnNames: ['posts'],
        referencedColumnNames: ['user'],
        referencedTableName: 'post_entity',
      }),
    );

    await queryRunner.createForeignKey(
      'post_entity',
      new TableForeignKey({
        columnNames: ['user'],
        referencedColumnNames: ['posts'],
        referencedTableName: 'user_entity',
        onDelete: 'CASCADE',
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    //без откатов
  }
}
