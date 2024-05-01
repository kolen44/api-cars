import { Module } from '@nestjs/common';
import { CardProductModule } from '@repository/repository/card-product/card-product.module';
import { SearcherCardProductService } from './services/searcher-card-product.service';
import { TestttController } from './testtt.controller';
import { TestttService } from './testtt.service';

@Module({
  imports: [CardProductModule],
  controllers: [TestttController],
  providers: [TestttService, SearcherCardProductService],
})
export class TestttModule {}
