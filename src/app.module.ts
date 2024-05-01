import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SparesModule } from './spares/spares.module';
import { TestttModule } from './testtt/testtt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SparesModule,
    TestttModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
