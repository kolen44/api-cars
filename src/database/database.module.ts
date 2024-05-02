import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardProduct } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardProduct])],
})
export class DatabaseModule {}
