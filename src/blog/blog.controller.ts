import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotAcceptableException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('post')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/parsing')
  async startParsing(@Body() data: { data: string }) {
    if (data.data == 'dkkdlmkd2ojfj3fo3ijf33jw;rf3w') {
      return await this.blogService.startAllParsers();
    } else {
      throw new NotAcceptableException('Вам такое действие недоступно');
    }
  }

  @Get('/pagination')
  async findAllWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.blogService.findAllWithPagination(page, limit);
  }

  @Get('findlent/:id/:count/:order')
  async findLent(
    @Param('id') id: number,
    @Param('count') count: number,
    @Param('order') order: string,
  ) {
    return await this.blogService.findLent(id, count, order);
  }

  @Get('findbyid/:id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }
}
