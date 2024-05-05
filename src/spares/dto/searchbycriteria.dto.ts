import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class searchByCriteriaDto {
  @IsOptional()
  @IsString()
  brand: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsNumber()
  @IsInt()
  @Type(() => Number)
  year: number;
}
