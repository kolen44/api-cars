import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import cheerio from 'cheerio';
import { format, parse } from 'date-fns';
import { PostEntity } from 'src/database/entities/post.entity';
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
  @Cron('0,30 * * * *')
  handleCron() {
    try {
      //в связи с тем что сайт avtopatus не отвечает на запросы
      //this.startAllParsers();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  getDateNow() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = now.getFullYear();

    return `${hours}:${minutes} ${day}-${month}-${year}`;
  }

  async create(createBlogDto: CreatePostDto, id: number) {
    const newPost: PostEntity = new PostEntity();
    const user = await this.userService.findById(id);
    newPost.user = user;
    newPost.author = user.fio;
    newPost.rating = 0;
    newPost.timestamp = this.getDateNow();
    if (createBlogDto.content) {
      newPost.content = createBlogDto.content;
    }
    if (createBlogDto.title) {
      newPost.title = createBlogDto.title;
    }
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

  async findLent(id: number, count: number, order: string) {
    if (count <= 0) {
      throw new BadRequestException('Укажите натуральный count');
    }

    const size = await this.blogRepository.count();
    if (count > size) {
      count = size;
    }

    const results = new Set();
    const existUser = await this.blogRepository.findOne({ where: { id: id } });
    if (existUser) {
      results.add(existUser);
    }

    const randomPostCount = Math.ceil(count * 0.2); // 20% of posts will be random
    const regularPostCount = count - randomPostCount;

    const usedIds = new Set([id]);

    // Helper function to add post to results
    const addPostById = async (postId: number) => {
      if (!usedIds.has(postId)) {
        const post = await this.blogRepository.findOne({
          where: { id: postId },
        });
        if (post) {
          results.add(post);
          usedIds.add(postId);
        }
      }
    };

    // Collect regular posts (newer posts)
    const fetchPosts = [];
    for (let i = 0; i < regularPostCount; i++) {
      const postId = order === 'asc' ? size - i : i + 1;
      fetchPosts.push(addPostById(postId));
    }
    await Promise.all(fetchPosts);

    // Collect random posts (prefer older posts)
    while (results.size < count) {
      const randomId =
        Math.random() < 0.8
          ? Math.floor(Math.random() * size * 0.1) + 1 // 80% chance to pick from the first 10% posts
          : Math.floor(Math.random() * size) + 1; // 20% chance to pick from the entire range
      await addPostById(randomId);
    }

    results.delete(existUser);
    const array = Array.from(results);
    return array;
  }

  async findAllWithPagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    if (await this.blogRepository.count()) {
      // Добавлено ожидание подсчета записей
      return this.blogRepository.find({
        order: { id: 'DESC' }, // Сортировка по убыванию идентификатора
        skip,
        take: limit,
      });
    }
    throw new NotFoundException('База данных временно пустая.');
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
  async fetchDataWithRetry(
    url: string,
    retries: number = 3,
    timeout: number = 10000,
  ): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, { timeout });
        return response.data;
      } catch (error) {
        if (i === 3) return;
        console.warn(`Retrying... (${i + 1}/${retries})`);
        // Экспоненциальная задержка между повторными попытками
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000),
        );
      }
    }
  }

  async parsingAvtoparusHtml() {
    try {
      const data = await this.fetchDataWithRetry(
        'https://www.autoparus.by/people/user-posts',
      );
      if (!data) {
        return console.log(
          'ошибка загрузки в parsingavtoparushtml. нормально при высокой загрузке',
        );
      }
      const $ = cheerio.load(data);
      const articles = $('article.content-item');

      const results = articles
        .map((index, element) => {
          const title = $(element)
            .find('h4.user__post_title_default')
            .text()
            .trim();
          const lead = $(element).find('div.post__lead').text().trim();
          const author = $(element).find('p.name').text().trim();
          const timestampHours = $(element)
            .find('span.time.ng-binding')
            .text()
            .trim();
          const timestampDays = $(element)
            .find('span.date.ng-binding')
            .text()
            .trim();
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
        content: this.processHtmlContent(item['content:encoded']), // Обработка HTML-контента
        author: item.author,
      })),
    };
    feed.items.forEach(async (element: any) => {
      const existPost = await this.blogRepository.findOne({
        where: { author: element.author, title: element.title },
      });
      if (!existPost) {
        const image_url = await this.parsingAvtoparusImage(element.link);
        // Удаляем тег <img> из контента, если его src соответствует image_url
        const processedContent = this.processHtmlContent(
          element.content.replace(
            new RegExp(
              `<figure> <img[^>]*?src=['"]${image_url}['"][^>]*?> </figure>`,
              'g',
            ),
            '',
          ),
        );
        this.blogRepository.save({
          author: element.author,
          id_writer: 0,
          title: element.title,
          content: processedContent,
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
