import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import cheerio from 'cheerio';
import { format, parse } from 'date-fns';
import { PostEntity } from 'src/database/entities/blog.entity';
import { NewscrudRoutesService } from 'src/newscrud_routes/newscrud_routes.service';
import { Repository } from 'typeorm';
import { parseStringPromise } from 'xml2js';
import { CreatePostDto } from './dto/create-blog.dto';
import { UpdatePostDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  private readonly timeout = 120000; // Increased timeout to 120 seconds
  private readonly maxRetries = 3; // Maximum number of retries
  constructor(
    @InjectRepository(PostEntity)
    private readonly blogRepository: Repository<PostEntity>,
    private readonly userService: NewscrudRoutesService,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  handleCron() {
    try {
      this.startAllParsers();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async create(createBlogDto: CreatePostDto, id: number) {
    const newPost: PostEntity = new PostEntity();
    const user = await this.userService.findById(id);
    newPost.title = createBlogDto.title;
    newPost.user = user;
    newPost.rating = 0;

    if (createBlogDto.avatar_url) {
      newPost.image_url = createBlogDto.avatar_url;
    }
    if (createBlogDto.url_video) {
      newPost.url_video = createBlogDto.url_video;
    }

    await this.blogRepository.save(newPost);
    return newPost.id;
  }

  async findAll(id: number) {
    return await this.blogRepository.find({
      where: { user: { id } },
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const isExist = await this.blogRepository.findOne({
      where: {
        id,
      },
    });
    if (!isExist)
      throw new NotFoundException('Пост с таким идентификатором не был найден');
    return isExist;
  }

  async findAllWithPagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    if (this.blogRepository.count()) {
      return this.blogRepository.find({
        skip,
        take: limit,
      });
    }
    return new NotFoundException('База данных временно пустая .');
  }

  async update(id: number, updateBlogDto: UpdatePostDto) {
    const isExist = await this.blogRepository.findOne({
      where: { id },
    });
    if (!isExist) throw new NotFoundException('Пост не найден');
    return await this.blogRepository.update(id, updateBlogDto);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: number, token: string, userId: number) {
    const isExist = await this.blogRepository.findOne({
      where: { id },
    });
    if (!isExist) throw new NotFoundException('Пост не найден');
    // try {
    //   await axios.delete(
    //     `https://kolen44-database-new-car-898e.twc1.net/database/post?userId=${userId}&token=${token}&blogId=${id}`,
    //   );
    // } catch (error) {
    //   throw new BadGatewayException(
    //     'Ошибка в блоке удаления и отправки запроса на базу данных',
    //   );
    // }
    return await this.blogRepository.delete(id);
  }

  //Дальше идет все что связано с парсингом
  async parsingAvtoparusHtml() {
    try {
      const response = await axios.get(
        'https://www.autoparus.by/people/user-posts',
      );
      const $ = cheerio.load(response.data); // Загрузка HTML с помощью Cheerio
      const articles = $('article.content-item');

      const results = articles
        .map((index, element) => {
          const title = $(element).find('h4.user__post_title_default').text();
          const lead = $(element).find('div.post__lead').text();
          const author = $(element).find('p.name').text();
          const timestampHours = $(element).find('span.time.ng-binding').text();
          const timestampDays = $(element).find('span.date.ng-binding').text();
          const timestamp = timestampHours + ' ' + timestampDays;
          const imgSrc = $(element).find('.img-photo').attr('src');
          const contentBlocks = $(element).find('div.post__text').html();
          return {
            author,
            title,
            lead,
            contentBlocks,
            timestamp,
            imgSrc,
          };
        })
        .get();

      for (const item of results) {
        const existPost = await this.blogRepository.findOne({
          where: { author: item.author, title: item.title },
        });
        if (!existPost) {
          // const content = item.lead
          //   ? `<p>${this.cleanHtmlString(item.content.replace(/"/g, "'"))}</p>`
          //   : `<p>${item.lead}</p><p>${this.cleanHtmlString(item.contentBlocks.replace(/"/g, "'"))}</p>`;
          await this.blogRepository.save({
            author: item.author,
            id_writer: 0,
            title: item.title,
            content:
              item.lead && item.contentBlocks
                ? `<p>${this.processHtmlContent(item.lead)}</p>${this.processHtmlContent(item.contentBlocks)}`
                : item.contentBlocks
                  ? `${this.processHtmlContent(item.contentBlocks)}`
                  : `<p>${this.processHtmlContent(item.lead)}</p>`,
            timestamp: item.timestamp,
            image_url: item.imgSrc,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error occurred while extracting data:', error);
      throw new Error(error);
    }
  }

  async parseRssFeed(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      const xmlData = response.data;
      const result = await parseStringPromise(xmlData, {
        explicitArray: false,
        mergeAttrs: true,
      });
      return this.processFeed(result.rss.channel);
    } catch (error) {
      console.error('Error fetching or parsing RSS feed', error);
      throw error;
    }
  }

  private processFeed(channel: any): any {
    const feed = {
      title: channel.title,
      description: channel.description,
      link: channel.link,
      language: channel.language,
      items: channel.item.map((item) => ({
        link: item.link,
        timestamp: this.formatDate(item.pubDate),
        title: item.title,
        category: item.category,
        content: item['content:encoded'],
        author: item.author,
      })),
    };
    feed.items.forEach(async (element: any) => {
      const existPost = await this.blogRepository.findOne({
        where: { author: element.author, title: element.title },
      });
      if (!existPost) {
        const image_url = await this.parsingAvtoparusImage(element.link);
        this.blogRepository.save({
          author: element.author,
          id_writer: 0,
          title: element.title,
          content: this.processHtmlContent(element.content.replace(/"/g, "'")),
          timestamp: element.timestamp,
          image_url,
        });
      }
    });
    return feed;
  }

  private processHtmlContent(content: string): string {
    // Удаление символов '\r'
    content = content.replace(/\r/g, '');

    // Удаление больших пробелов
    content = content.replace(/\s+/g, ' ');

    // Оставление только адекватных тегов
    const allowedTags = ['figure', 'img', 'p'];
    const regex = new RegExp(`<(${allowedTags.join('|')})[^>]*>`, 'gi');
    content = content.replace(regex, (match) => match.toLowerCase());

    // Очистка HTML сущностей и символов перевода строки
    content = this.cleanHtmlString(content);

    return content;
  }

  private cleanHtmlContent(htmlContent) {
    if (!htmlContent) {
      return ''; // Возвращаем пустую строку, если htmlContent null, undefined или пустая строка
    }
    return htmlContent
      .replace(/\s*\n\s*/g, '') // Убираем переводы строк и лишние пробелы вокруг них
      .replace(/\s\s+/g, ' ') // Убираем лишние пробелы
      .trim(); // Убираем пробелы в начале и конце строки
  }

  private cleanHtmlString(input: string): string {
    // Create a map for HTML entities and their corresponding characters
    const htmlEntitiesMap: { [key: string]: string } = {
      '&quot;': "'",
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&nbsp;': ' ',
    };

    // Replace HTML entities in the input string
    let cleanedString = input.replace(
      /&quot;|&amp;|&lt;|&gt;|&nbsp;/g,
      (match) => htmlEntitiesMap[match],
    );

    // Remove all occurrences of \n
    cleanedString = cleanedString.replace(/\n/g, '');

    return cleanedString;
  }

  private formatDate(pubDate: string): string {
    const date = parse(pubDate, 'EEE, dd MMM yyyy HH:mm:ss xx', new Date());
    return format(date, 'HH:mm dd.MM.yyyy');
  }

  private async parsingAvtoparusImage(link: string) {
    try {
      const response = await axios.get(link);
      const $ = cheerio.load(response.data);

      const imgSrc = $('img.lazy').attr('src');

      return imgSrc || '';
    } catch (error) {
      console.log('Error occurred while extracting image data:', error);
      return '';
    }
  }

  async startAllParsers() {
    await this.parsingAvtoparusHtml();
    this.parseRssFeed('https://www.autoparus.by/google/news.xml');
    return;
  }
}
