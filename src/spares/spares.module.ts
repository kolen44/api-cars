import { SparesCsvModule } from '@app/sparescsv';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CardProductModule } from '@repository/repository/card-product/card-product.module';
import { SearcherCardProductService } from './services/searcher-card-product.service';
import { SparesController } from './spares.controller';
import { SparesService } from './spares.service';

@Module({
  imports: [
    SparesCsvModule,
    MulterModule.register({
      dest: './data',
    }),
    CardProductModule,
  ],
  controllers: [SparesController],
  providers: [SparesService, SearcherCardProductService],
})
export class SparesModule {}
