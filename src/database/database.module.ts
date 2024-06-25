import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NewsUserCreateEntity } from 'src/database/entities/newscrud_route.entity';
import { PostEntity } from './entities/post.entity';
import { CardProduct } from './entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        url: configService.get('DB_LINK'),
        synchronize: false,
        entities: [CardProduct, NewsUserCreateEntity, PostEntity],
        extra: {
          work_mem: '64MB',
          enable_bitmapscan: 'off',
          autovacuum: true,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
