import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CardProductService } from './card-product.service'
import { CardProduct } from 'src/database/entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CardProduct])],
  providers: [CardProductService],
  exports: [CardProductService],
})
export class CardProductModule {}
