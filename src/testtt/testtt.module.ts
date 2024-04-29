import { SparesCsvModule } from '@app/sparescsv';
import { Module } from '@nestjs/common';
import { CardProductModule } from '@repository/repository/card-product/card-product.module';
import { TestttController } from './testtt.controller';
import { TestttService } from './testtt.service';

@Module({
  imports: [CardProductModule, SparesCsvModule],
  controllers: [TestttController],
  providers: [TestttService],
})
export class TestttModule {}
