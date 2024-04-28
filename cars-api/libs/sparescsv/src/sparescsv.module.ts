import { Module } from '@nestjs/common';
import { CsvModule, CsvParser } from 'nest-csv-parser';
import { SparesCsvService } from './sparescsv.service';

@Module({
  imports: [CsvModule, CsvParser],
  providers: [SparesCsvService],
  exports: [SparesCsvService],
})
export class SparesCsvModule {}
