import { Controller, Get } from '@nestjs/common';
import { NewsAvtoparusXmlService } from './news_avtoparus_xml.service';

@Controller('news-avtoparus-xml')
export class NewsAvtoparusXmlController {
  constructor(
    private readonly newsAvtoparusXmlService: NewsAvtoparusXmlService,
  ) {}

  @Get('parsingxml')
  parsingAvtoparusXml() {
    return this.newsAvtoparusXmlService.parseRssFeed(
      'https://www.autoparus.by/google/news.xml',
    );
  }

  @Get('parsinghtml')
  parsingAvtoparusHtml() {
    return this.newsAvtoparusXmlService.parsingAvtoparusHtml();
  }
}
