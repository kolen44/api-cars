import { Controller, Get } from '@nestjs/common';
import { TestttService } from './testtt.service';

@Controller('testtt')
export class TestttController {
  constructor(private readonly testttService: TestttService) {}

  @Get()
  test() {
    return this.testttService.test();
  }
}
