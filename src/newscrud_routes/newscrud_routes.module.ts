import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/database/entities/blog.entity';
import { JwtStrategy } from 'src/strategies/jwt.strategies';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { NewsUserCreateEntity } from '../database/entities/newscrud_route.entity';
import { NewscrudRoutesController } from './newscrud_routes.controller';
import { NewscrudRoutesService } from './newscrud_routes.service';

@Module({
  imports: [
    NewsUserCreateEntity,
    TypeOrmModule.forFeature([NewsUserCreateEntity, PostEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NewscrudRoutesController],
  providers: [
    NewscrudRoutesService,
    NewsUserCreateEntity,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class NewscrudRoutesModule {}
