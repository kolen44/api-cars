import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsUserCreateEntity } from 'src/database/entities/newscrud_route.entity';
import { PostEntity } from './entities/post.entity';
import { CardProduct } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_LINK'),
        entities: [CardProduct, NewsUserCreateEntity, PostEntity],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
