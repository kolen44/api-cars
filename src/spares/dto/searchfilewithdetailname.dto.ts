import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class searchByCriteriaDetailNameDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  brand: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  model: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  year: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  detail_name: string;
}
