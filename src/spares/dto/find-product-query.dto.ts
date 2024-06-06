import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortDirection, SortKey } from '../classes/find-card-product/sort.enum';

export class FindProductQueryDto {
  @IsOptional()
  @IsIn([SortKey.YEAR, SortKey.PRICE])
  sort: SortKey = SortKey.YEAR;

  @IsOptional()
  @IsIn([SortDirection.ASC, SortDirection.DESC])
  order: SortDirection = SortDirection.ASC;

  @IsOptional()
  @IsString()
  article: string;

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
  @IsString()
  original_number: string;

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
  @IsString()
  body_type: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  year: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  year_start: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  year_end: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  limit: number = 20;
}
