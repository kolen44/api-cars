import { SparesCsvModule } from '@app/sparescsv';
import { Module } from '@nestjs/common';
import { SparesController } from './spares.controller';
import { SparesService } from './spares.service';

@Module({
  imports: [SparesCsvModule],
  controllers: [SparesController],
  providers: [SparesService],
})
export class SparesModule {}
