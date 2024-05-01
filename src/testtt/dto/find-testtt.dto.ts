import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindTestttDto {
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
  volume: number;

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
