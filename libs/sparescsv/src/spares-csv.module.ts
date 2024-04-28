import { Module } from '@nestjs/common'
import { SparesCsvService } from './spares-csv.service'

@Module({
  providers: [SparesCsvService],
  exports: [SparesCsvService],
})
export class SparesCsvModule {}
