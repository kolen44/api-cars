import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NewsUserCreateEntity } from 'src/database/entities/newscrud_route.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { CardProduct } from './entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const options: DataSourceOptions = {
          type: 'postgres',
          url: configService.get('DB_LINK'),
          synchronize: false,
          entities: [CardProduct, NewsUserCreateEntity, PostEntity],
        };

        const dataSource = new DataSource(options);
        await dataSource.initialize();

        await dataSource.query("SET work_mem = '64MB'");
        await dataSource.query('SET enable_bitmapscan = OFF');
        await dataSource.destroy();

        return {
          ...options,
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
