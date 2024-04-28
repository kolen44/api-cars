import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CardProductModule } from '@repository/repository/card-product/card-product.module'
import { SparesCsvModule } from '@sparescsv/sparescsv'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { RouterModule } from './router/router.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RouterModule,
    DatabaseModule,
    CardProductModule,
    SparesCsvModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
