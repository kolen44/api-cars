import { Injectable } from '@nestjs/common';
import { CreateNewsAvtoparusXmlDto } from './dto/create-news_avtoparus_xml.dto';

@Injectable()
export class NewsAvtoparusXmlService {
  create(createNewsAvtoparusXmlDto: CreateNewsAvtoparusXmlDto) {
    return 'This action adds a new newsAvtoparusXml';
  }
}
