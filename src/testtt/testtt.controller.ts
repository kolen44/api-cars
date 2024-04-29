import { Controller, Get, Post, Query } from '@nestjs/common';
import { FindTestttDto } from './dto/find-testtt.dto';
import { TestttService } from './testtt.service';

@Controller('route')
export class TestttController {
  constructor(private readonly testttService: TestttService) {}

  @Get()
  getProduct(@Query() query: FindTestttDto) {
    return this.testttService.getProduct(query);
  }

  @Post('d')
  downloadDatabase() {
    return this.testttService.downloadDatabase();
  }

  @Get('test')
  test() {
    return this.testttService.test();
  }
}
