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
          host: configService.get('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          synchronize: true,
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
