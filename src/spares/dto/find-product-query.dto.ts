import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindProductQueryDto {
  @IsOptional()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  engine: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  volume: number;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  detail_names: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year_start: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year_end: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number = 20;
}
