import { SparesCsvModule } from '@app/sparescsv';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SparesController } from './spares.controller';
import { SparesService } from './spares.service';

@Module({
  imports: [
    SparesCsvModule,
    MulterModule.register({
      dest: './data',
    }),
  ],
  controllers: [SparesController],
  providers: [SparesService],
})
export class SparesModule {}
