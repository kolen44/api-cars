import { Module } from '@nestjs/common';
import { TestttService } from './testtt.service';
import { TestttController } from './testtt.controller';

@Module({
  controllers: [TestttController],
  providers: [TestttService],
})
export class TestttModule {}
