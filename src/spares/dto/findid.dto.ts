import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsInt()
  @IsNumber()
  @Type(() => Number)
  id: number;
}
