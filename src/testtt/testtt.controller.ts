import { Controller, Get, Post, Query } from '@nestjs/common';
import { TestttService } from './testtt.service';

@Controller('route')
export class TestttController {
  constructor(private readonly testttService: TestttService) {}

  @Get()
  async getProduct(@Query() a: any) {
    console.log(a);
    return await this.testttService.getProduct(a);
  }

  @Post('d')
  downloadDatabase() {
    console.log(1);
    return this.testttService.downloadDatabase();
  }
}
