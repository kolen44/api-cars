import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  NotAcceptableException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NewsUserCreateEntity } from 'src/database/entities/newscrud_route.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.giard';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-blog.dto';
import { UpdatePostDto } from './dto/update-blog.dto';

@Controller('post')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createBlogDto: CreatePostDto, @Req() req) {
    return this.blogService.create(createBlogDto, req.user.id);
  }

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
    console.log(page + ' ' + limit);
    return this.blogService.findAllWithPagination(page, limit);
  }

  @Get(':id')
  findAll(@Param('id') id: number) {
    return this.blogService.findAll(id);
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdatePostDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
    @Request() req,
  ) {
    const user: NewsUserCreateEntity = { ...req.user };
    const userId: number = user.id;
    const token: string = authHeader.replace('Bearer ', '');
    return this.blogService.remove(+id, token, userId);
  }
}
