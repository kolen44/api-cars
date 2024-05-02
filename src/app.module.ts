import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SparesModule } from './spares/spares.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SparesModule,
    DatabaseModule,
    // TestttModule, // Если нужно будет использовать мою загрузку в бд
  ],
})
export class AppModule {}
