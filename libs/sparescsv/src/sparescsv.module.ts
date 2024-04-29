import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CsvModule, CsvParser } from 'nest-csv-parser';
import { SparesCsvService } from './sparescsv.service';

@Module({
  imports: [
    CsvModule,
    CsvParser,
    MulterModule.register({
      dest: './data',
    }),
  ],
  providers: [SparesCsvService],
  exports: [SparesCsvService],
})
export class SparesCsvModule {}
