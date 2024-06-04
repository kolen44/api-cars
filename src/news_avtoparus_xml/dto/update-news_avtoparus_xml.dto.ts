import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsAvtoparusXmlDto } from './create-news_avtoparus_xml.dto';

export class UpdateNewsAvtoparusXmlDto extends PartialType(CreateNewsAvtoparusXmlDto) {}
