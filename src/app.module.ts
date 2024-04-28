import { Module } from '@nestjs/common'
import { CardProductModule } from '@repository/repository/card-product/card-product.module'
import { SparesCsvModule } from '@sparescsv/sparescsv'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GlobalModule } from './global/global.module'
import { RouterModule } from './router/router.module'

@Module({
  imports: [
    GlobalModule,
    RouterModule,

    CardProductModule, // TODO Удалить
    SparesCsvModule, // TODO Удалить
  ],

  controllers: [AppController], // TODO Удалить
  providers: [AppService], // TODO Удалить
})
export class AppModule {}
