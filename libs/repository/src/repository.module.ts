import { Module } from '@nestjs/common'
import { CardProductModule } from './card-product/card-product.module'
import { RepositoryService } from './repository.service'

@Module({
  imports: [CardProductModule],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
