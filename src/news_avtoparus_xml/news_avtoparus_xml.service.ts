import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { format, parse } from 'date-fns';
import puppeteerExtra from 'puppeteer-extra';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class NewsAvtoparusXmlService {
  private readonly timeout = 120000; // Increased timeout to 120 seconds
  private readonly maxRetries = 3; // Maximum number of retries

  constructor() {}

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
          const autor = autorElement
            ? (autorElement as HTMLElement).innerText
            : '';
          const lead = leadElement
            ? (leadElement as HTMLElement).innerText
            : '';
          const imgSrc = imgElement ? imgElement.src : '';

          let content = "<p className='post__text'>";
          textBlocks.forEach((block) => {
            const isBold = block.querySelector('strong') !== null;
            if (isBold) {
              content += `<span className='bold'>${(block as HTMLElement).innerText}</span>`;
            } else {
              content += (block as HTMLElement).innerText;
            }
            content += ' '; // Adding space between paragraphs
          });
          content += '</p>';

          results.push({
            autor,
            title,
            lead,
            content,
            timestamp,
            imgSrc,
          });
        });

        return results;
      });
      return content;
    } catch (error) {
      console.log('Error occurred while extracting data:', error);
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
        description: item.description,
        category: item.category,
        content: `<p>${this.processContent(item['content:encoded'])}</p>`,
        author: item.author,
      })),
    };
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
}
