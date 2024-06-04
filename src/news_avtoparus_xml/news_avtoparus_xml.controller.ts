import {
  Controller
} from '@nestjs/common'
import { NewsAvtoparusXmlService } from './news_avtoparus_xml.service'

@Controller('news-avtoparus-xml')
export class NewsAvtoparusXmlController {
  constructor(
    private readonly newsAvtoparusXmlService: NewsAvtoparusXmlService,
  ) {}
}
