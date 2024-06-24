import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NewsUserCreateEntity } from 'src/database/entities/newscrud_route.entity';
import { ConnectionOptions, createConnection } from 'typeorm';
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
        const connectionOptions: ConnectionOptions = {
          type: 'postgres',
          url: configService.get('DB_LINK'),
          synchronize: false,
          entities: [CardProduct, NewsUserCreateEntity, PostEntity],
          extra: {
            work_mem: '64MB',
            enable_bitmapscan: 'off',
            autovacuum: true,
          },
        };

        const connection = await createConnection(connectionOptions);
        return connection.options;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
