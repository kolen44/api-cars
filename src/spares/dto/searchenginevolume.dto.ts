import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class searchByCriteriaEngineVolumeDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  brand: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  model: string;

  @IsOptional()
  @IsInt()
  year: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  engine: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  volume: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  detail_name: string;
}
