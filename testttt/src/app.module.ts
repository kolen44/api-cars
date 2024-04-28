import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SparesModule } from './spares/spares.module'

@Module({
  imports: [SparesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
