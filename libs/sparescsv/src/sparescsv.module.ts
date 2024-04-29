import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CsvModule, CsvParser } from 'nest-csv-parser';
import { RmqModule } from 'src/rmq/rmq.module';
import { SparesCsvService } from './sparescsv.service';

@Module({
  imports: [
    CsvModule,
    CsvParser,
    MulterModule.register({
      dest: './data',
    }),
    RmqModule.register({
      name: 'billing',
    }),
  ],
  providers: [SparesCsvService],
  exports: [SparesCsvService],
})
export class SparesCsvModule {}
