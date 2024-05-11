import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-blog.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
