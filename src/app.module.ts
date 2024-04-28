import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { RouterModule } from './router/router.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RouterModule,
    DatabaseModule,
  ],
})
export class AppModule {}
