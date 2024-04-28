import { Module } from '@nestjs/common'
import { SparesModule } from 'src/spares/spares.module'

@Module({
  imports: [SparesModule],
})
export class RouterModule {}
