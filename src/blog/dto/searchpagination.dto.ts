import { IsNumber, IsOptional } from 'class-validator';

export class searchPagination {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;
}
