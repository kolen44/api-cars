import { PartialType } from '@nestjs/mapped-types';
import { NewsUserCreateDto } from './create-newscrud_route.dto';

export class UpdateNewscrudRouteDto extends PartialType(NewsUserCreateDto) {}
