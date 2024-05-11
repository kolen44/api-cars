import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/database/entities/blog.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-blog.dto';
import { UpdatePostDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly blogRepository: Repository<PostEntity>,
  ) {}

  async create(createBlogDto: CreatePostDto, id: number) {
    const existUser = await this.blogRepository.findBy({
      user: { id },
      title: createBlogDto.title,
      description: createBlogDto.description,
    });
    if (existUser.length)
      throw new BadRequestException(
        'Категория с таким названием и описанием у пользователя уже существует!',
      );

    const newPost: any = {
      title: createBlogDto.title,
      description: createBlogDto.description,
      user: { id },
      rating: 0,
    };

    if (createBlogDto.avatar_url) {
      newPost.avatar_url = createBlogDto.avatar_url;
    }
    if (createBlogDto.url_video) {
      newPost.url_video = createBlogDto.url_video;
    }

    return await this.blogRepository.save(newPost);
  }

  async findAll(id: number) {
    return await this.blogRepository.find({
      where: { user: { id } },
    });
  }

  async findOne(id: number) {
    const isExist = await this.blogRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
    if (!isExist)
      throw new NotFoundException('Пост с таким идентификатором не был найден');
    return isExist;
  }

  async findAllWithPagination(page?: number, limit?: number) {
    const skip = (page - 1) * limit;
    if (this.blogRepository.count()) {
      return this.blogRepository.find({
        skip,
        take: limit,
      });
    }
    return new NotFoundException('База данных временно пустая .');
  }

  async update(id: number, updateBlogDto: UpdatePostDto) {
    const isExist = await this.blogRepository.findOne({
      where: { id },
    });
    if (!isExist) throw new NotFoundException('Пост не найден');
    return await this.blogRepository.update(id, updateBlogDto);
  }

  async remove(id: number) {
    const isExist = await this.blogRepository.findOne({
      where: { id },
    });
    if (!isExist) throw new NotFoundException('Пост не найден');
    return await this.blogRepository.delete(id);
  }
}
