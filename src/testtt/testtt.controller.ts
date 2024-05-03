import { Controller, Post } from '@nestjs/common';
import { TestttService } from './testtt.service';

@Controller('route')
export class TestttController {
  constructor(private readonly testttService: TestttService) {}

  @Post('d')
  downloadDatabase() {
    return this.testttService.downloadDatabase();
  }
}
