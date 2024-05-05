import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class Find3ParametersDto {
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
  @IsInt()
  @Type(() => Number)
  id: number;
}
