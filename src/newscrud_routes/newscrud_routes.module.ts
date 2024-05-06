import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsUserCreateEntity } from './entities/newscrud_route.entity';
import { NewscrudRoutesController } from './newscrud_routes.controller';
import { NewscrudRoutesService } from './newscrud_routes.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE2'),
        synchronize: true,
        entities: [NewsUserCreateEntity],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NewscrudRoutesController],
  providers: [NewscrudRoutesService],
})
export class NewscrudRoutesModule {}
