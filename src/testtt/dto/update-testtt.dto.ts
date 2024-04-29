import { PartialType } from '@nestjs/mapped-types';
import { CreateTestttDto } from './create-testtt.dto';

export class UpdateTestttDto extends PartialType(CreateTestttDto) {}
