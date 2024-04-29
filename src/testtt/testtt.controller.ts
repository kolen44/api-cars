import { Controller, Get, Post, Query } from '@nestjs/common';
import { FindTestttDto } from './dto/find-testtt.dto';
import { TestttService } from './testtt.service';

@Controller('route')
export class TestttController {
  constructor(private readonly testttService: TestttService) {}

  @Get()
  async getProduct(@Query() query: FindTestttDto) {
    console.log(query);
    return await this.testttService.getProduct(query);
  }

  @Post('d')
  downloadDatabase() {
    return this.testttService.downloadDatabase();
  }
}
