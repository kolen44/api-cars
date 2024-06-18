import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardProduct } from 'src/database/entities/product.entity';
import { CardProductService } from './card-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([CardProduct])],
  providers: [CardProductService],
  exports: [CardProductService],
})
export class CardProductModule {}
