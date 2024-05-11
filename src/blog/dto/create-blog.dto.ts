import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { NewsUserCreateEntity } from 'src/database/entities/newscrud_route.entity';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @MinLength(10)
  avatar_url?: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  user?: NewsUserCreateEntity;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Пожалуйста , проверьте ссылку на видео' })
  url_video?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;
}
