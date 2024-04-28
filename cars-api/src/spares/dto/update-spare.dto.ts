import { PartialType } from '@nestjs/mapped-types';
import { CreateSpareDto } from './create-spare.dto';

export class UpdateSpareDto extends PartialType(CreateSpareDto) {}
