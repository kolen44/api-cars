import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { PostEntity } from 'src/database/entities/blog.entity';
import { NewscrudRoutesService } from 'src/newscrud_routes/newscrud_routes.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-blog.dto';
import { UpdatePostDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly blogRepository: Repository<PostEntity>,
    private readonly userService: NewscrudRoutesService,
  ) {}

  async create(createBlogDto: CreatePostDto, id: number) {
    const existUser = await this.blogRepository.findOne({
      where: {
        user: { id },
        title: createBlogDto.title,
        description: createBlogDto.description,
      },
      relations: ['user'],
    });
    if (existUser)
      throw new BadRequestException(
        'Категория с таким названием и описанием у пользователя уже существует!',
      );
    const newPost: PostEntity = new PostEntity();
    const user = await this.userService.findById(id);
    newPost.title = createBlogDto.title;
    newPost.description = createBlogDto.description;
    newPost.user = user;
    newPost.rating = 0;

    if (createBlogDto.avatar_url) {
      newPost.avatar_url = createBlogDto.avatar_url;
    }
    if (createBlogDto.url_video) {
      newPost.url_video = createBlogDto.url_video;
    }

    await this.blogRepository.save(newPost);
    return newPost.id;
  }

  async findAll(id: number) {
    return await this.blogRepository.find({
      where: { user: { id } },
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const isExist = await this.blogRepository.findOne({
      where: {
        id,
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

  async remove(id: number, token: string, userId: number) {
    const isExist = await this.blogRepository.findOne({
      where: { id },
    });
    if (!isExist) throw new NotFoundException('Пост не найден');
    try {
      await axios.delete(
        `https://kolen44-database-new-car-898e.twc1.net/database/post?userId=${userId}&token=${token}&blogId=${id}`,
      );
    } catch (error) {
      throw new BadGatewayException(
        'Ошибка в блоке удаления и отправки запроса на базу данных',
      );
    }
    return await this.blogRepository.delete(id);
  }
}
