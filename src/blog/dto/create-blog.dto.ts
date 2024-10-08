import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @MinLength(10)
  avatar_url?: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Пожалуйста , проверьте ссылку на видео' })
  url_video?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;
}
