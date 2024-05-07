import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { NewsUserCreateEntity } from 'src/database/entities/newscrud_route.entity';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @MinLength(10)
  avatar_url?: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  user?: NewsUserCreateEntity;
}
