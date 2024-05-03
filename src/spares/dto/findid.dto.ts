import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindIdDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  article: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  original_number: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id: number;
}
