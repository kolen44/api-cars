import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { format, parse } from 'date-fns';
import puppeteerExtra from 'puppeteer-extra';
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
    const browser = await puppeteerExtra.launch();

    const page = await browser.newPage();

    await page.setViewport({
      width: 1600,
      height: 1000,
      isMobile: false,
      isLandscape: true,
      hasTouch: false,
      deviceScaleFactor: 1,
    });
    await page.setGeolocation({ latitude: 49.5, longitude: 100.0 });

    const navigateToPage = async (retryCount = 0): Promise<boolean> => {
      try {
        await page.goto('https://www.autoparus.by/people/user-posts', {
          waitUntil: 'networkidle2',
          timeout: this.timeout,
        });

        await page.waitForSelector('.content__main', { timeout: this.timeout });

        await page.waitForFunction(
          'document.querySelector(".content__main") && document.querySelectorAll(".content__main").length > 0',
          { timeout: this.timeout },
        );
        return true;
      } catch (error) {
        console.log(`Error occurred on attempt ${retryCount + 1}:`, error);
        if (retryCount < this.maxRetries - 1) {
          return await navigateToPage(retryCount + 1);
        } else {
          console.log('Max retries reached. Could not load the page.');
          return false;
        }
      }
    };

    const pageLoaded = await navigateToPage();
    if (!pageLoaded) {
      await browser.close();
      return;
    }
    try {
      const content = await page.evaluate(() => {
        const articles = document.querySelectorAll('article.content-item');
        const results = [];

        articles.forEach((article) => {
          const titleElement = article.querySelector(
            'h4.user__post_title_default',
          );
          const leadElement = article.querySelector('div.post__lead');
          const autorElement = article.querySelector('p.name');
          const timestampHoursElement = article.querySelector(
            'span.time.ng-binding',
          );
          const timestampDaysElement = article.querySelector(
            'span.date.ng-binding',
          );
          const imgElement = document.querySelector(
            '.img-photo',
          ) as HTMLImageElement;
          const textBlocks = article.querySelectorAll('div.post__text p');

          const title = titleElement
            ? (titleElement as HTMLElement).innerText
            : '';
          const timestamp =
            (timestampHoursElement as HTMLElement).innerText +
            ' ' +
            (timestampDaysElement as HTMLElement).innerText;
          const author = autorElement
            ? (autorElement as HTMLElement).innerText
            : '';
          const lead = leadElement
            ? (leadElement as HTMLElement).innerText
            : '';
          const imgSrc = imgElement ? imgElement.src : '';

          let content = '';
          if (lead) {
            content += `<p>${lead}</p>`;
          }
          textBlocks.forEach((block) => {
            const isBold = block.querySelector('strong') !== null;
            //если потом нужно будет span добавить это заготовка
            if (isBold) {
              content += `<p>${(block as HTMLElement).innerHTML}</p>`;
            } else {
              content += `<p>${(block as HTMLElement).innerHTML}</p>`;
            }
            content += ' '; // Adding space between paragraphs
          });

          results.push({
            author,
            title,
            lead,
            content,
            timestamp,
            imgSrc,
          });
        });

        return results;
      });

      // Теперь сохраняем собранные данные в базу данных
      for (const item of content) {
        const existPost = await this.blogRepository.findOne({
          where: { author: item.author, title: item.title },
        });
        if (!existPost) {
          await this.blogRepository.save({
            author: item.author,
            id_writer: 0,
            title: item.title,
            lead: item.lead,
            content: item.content.replace(/"/g, "'"),
            timestamp: item.timestamp,
            image_url: item.imgSrc,
          });
        }
      }

      return content;
    } catch (error) {
      throw new Error(error);
    } finally {
      await browser.close();
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
          content: element.content.replace('"', "'"),
          timestamp: element.timestamp,
          image_url,
        });
      }
    });
    return feed;
  }

  private processContent(content: string): string {
    const $ = cheerio.load(content);
    $('figure').each((i, elem) => {
      const img = $(elem).find('img').attr('src');
      if (img) {
        $(elem).replaceWith(`<img src="${img}">`);
      }
    });

    const cleanContent = $.text().replace(/\s+/g, ' ').trim();
    return cleanContent;
  }

  private formatDate(pubDate: string): string {
    const date = parse(pubDate, 'EEE, dd MMM yyyy HH:mm:ss xx', new Date());
    return format(date, 'HH:mm dd.MM.yyyy');
  }

  private async parsingAvtoparusImage(link: string) {
    const browser = await puppeteerExtra.launch();

    const page = await browser.newPage();

    await page.setViewport({
      width: 1600,
      height: 1000,
      isMobile: false,
      isLandscape: true,
      hasTouch: false,
      deviceScaleFactor: 1,
    });

    const navigateToPage = async (retryCount = 0): Promise<boolean> => {
      try {
        await page.goto(link, {
          waitUntil: 'networkidle2',
          timeout: this.timeout,
        });

        await page.waitForSelector('div.image__container', {
          timeout: this.timeout,
        });

        await page.waitForFunction(
          'document.querySelector("div.image__container") && document.querySelectorAll("div.image__container").length > 0',
          { timeout: this.timeout },
        );
        return true;
      } catch (error) {
        console.log(`Error occurred on attempt ${retryCount + 1}:`, error);
        if (retryCount < this.maxRetries - 1) {
          return await navigateToPage(retryCount + 1);
        } else {
          console.log('Max retries reached. Could not load the page.');
          return false;
        }
      }
    };

    const pageLoaded = await navigateToPage();
    if (!pageLoaded) {
      await browser.close();
      return;
    }
    try {
      const content = await page.evaluate(() => {
        const imgElement = document.querySelector(
          'img.lazy',
        ) as HTMLImageElement;
        return imgElement ? imgElement.src : '';
      });
      return content;
    } catch (error) {
      console.log('Error occurred while extracting data:', error);
    } finally {
      await browser.close();
    }
  }

  async startAllParsers() {
    await this.parsingAvtoparusHtml();
    this.parseRssFeed('https://www.autoparus.by/google/news.xml');
    return;
  }
}
