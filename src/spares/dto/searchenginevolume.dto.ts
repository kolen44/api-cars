import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsNumber()
  @IsInt()
  @Type(() => Number)
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
