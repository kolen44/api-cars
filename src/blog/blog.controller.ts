import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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

  @Get(':id')
  findAll(@Param('id') id: number) {
    return this.blogService.findAll(id);
  }

  @Get('/pagination')
  async findAllWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.blogService.findAllWithPagination(page, limit);
  }

  @Get(':id')
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
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
