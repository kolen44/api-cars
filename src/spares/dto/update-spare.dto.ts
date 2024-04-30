import { PartialType } from '@nestjs/mapped-types';
import { searchByCriteriaDto } from './searchbycriteria.dto';

export class UpdateSpareDto extends PartialType(searchByCriteriaDto) {}
