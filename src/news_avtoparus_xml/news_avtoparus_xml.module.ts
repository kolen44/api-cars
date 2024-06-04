import { Module } from '@nestjs/common';
import { NewsAvtoparusXmlService } from './news_avtoparus_xml.service';
import { NewsAvtoparusXmlController } from './news_avtoparus_xml.controller';

@Module({
  controllers: [NewsAvtoparusXmlController],
  providers: [NewsAvtoparusXmlService],
})
export class NewsAvtoparusXmlModule {}
