import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as csv from 'csv-parser';
import { createReadStream } from 'fs';
import { CsvToJsonFifthFile } from 'libs/csv-files/classescsvtojson/fifthfile/csvtojson.class';
import { CsvToJsonFirstFile } from 'libs/csv-files/classescsvtojson/firstfile/csvtojson.class';
import { CsvToJsonFourthFile } from 'libs/csv-files/classescsvtojson/fourthfile/csvtojson.class';
import { CsvToJsonThirdFile } from 'libs/csv-files/classescsvtojson/thirdfile/csvtojson.class';
import { CardProductFifthFile } from 'libs/csv-files/interface/fifthfile/csvfifth(104)';
import { CardProductFourthFile } from 'libs/csv-files/interface/fourthfile/csvfourth(103)';
import { CardProductThirdFile } from 'libs/csv-files/interface/thirdfile/csvthird(102)';
import { CsvParser } from 'nest-csv-parser';
import { Readable } from 'stream';
import { CsvToJsonSecondFile } from '../../classescsvtojson/secondfile/csvtojson.class';
import { CardProduct } from '../../interface/firstfile/csvfirst(165)';
import { CardProductSecondFile } from '../../interface/secondfile/cvssecond(101)';

@Injectable()
export class SparesCsvService {
  private BATCH_SIZE = 5000;
  private PAUSE_DURATION = 500; // 100 ms pause
  constructor(public csvParser: CsvParser) {}

  public async cvsUpdate(file) {
    const results = [];
    return new Promise((resolve, reject) => {
      createReadStream(file.path)
        .pipe(csv())
        .on('data', (row) => {
          results.push(row);
          console.log(row);
        })
        .on('end', () => {
          resolve(results);
          console.log('Чтение CSV файла завершено');
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  public async parseCvsToJson(url) {
    const csvToJson = new CsvToJsonFirstFile();

    const foo = (obj: Record<string, string>) => {
      let result: Partial<CardProduct> = {};

      result = csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      );
      return result as CardProduct;
    };
    const rows: CardProduct[] = [];
    const source = axios.CancelToken.source();

    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
      cancelToken: source.token,
    });

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(response.data);
      readableStream
        .pipe(csv())
        .on('data', (row) => {
          rows.push(foo(row));
        })
        .on('end', () => {
          source.cancel('Reached 633064 rows');
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  public async parseCvsToJsonSecondFile(
    url: string,
  ): Promise<CardProductSecondFile[]> {
    const csvToJson = new CsvToJsonSecondFile();

    const foo = (obj: Record<string, string>): CardProductSecondFile => {
      const result = csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      );
      return result as CardProductSecondFile;
    };

    const rows: CardProductSecondFile[] = [];
    console.log('begin');

    const source = axios.CancelToken.source();

    try {
      const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream',
        cancelToken: source.token,
      });

      console.log('end');

      const stream = response.data as Readable;

      return new Promise(async (resolve, reject) => {
        let processedRows = 0;

        const processBatch = async () => {
          await this.delay(this.PAUSE_DURATION);
        };

        stream
          .pipe(csv())
          .on('data', async (row) => {
            rows.push(foo(row));
            processedRows++;

            if (processedRows % this.BATCH_SIZE === 0) {
              stream.pause();
              await processBatch();
              stream.resume();
            }

            if (rows.length >= 633064) {
              source.cancel('Reached 633064 rows');
            }
          })
          .on('end', () => {
            resolve(rows);
          })
          .on('error', (error) => {
            if (axios.isCancel(error)) {
              console.log('Request canceled:', error.message);
            } else {
              reject(error);
            }
          });
      });
    } catch (error) {
      console.error('Error during CSV parsing:', error);
      throw error;
    }
  }

  public async parseCvsToJsonThirdFile(url: string) {
    const csvToJson = new CsvToJsonThirdFile();

    const foo = (obj: Record<string, string>) => {
      let result: Partial<CardProductThirdFile> = {};
      result = csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      );

      const imageUrls = [];
      Object.keys(obj).forEach((key) => {
        if (key.startsWith('_') && !key.startsWith('_1')) {
          const url = obj[key].split(';')[0];
          if (url.startsWith('https://')) {
            imageUrls.push(url);
          }
        }
      });
      if (imageUrls.length > 0) {
        (result as any).url_photo_details = imageUrls.join(',');
      }
      return result as CardProductThirdFile;
    };
    const rows: CardProductThirdFile[] = [];
    const source = axios.CancelToken.source();

    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
      cancelToken: source.token,
    });

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(response.data);
      readableStream
        .pipe(csv())
        .on('data', (row) => {
          rows.push(foo(row));
        })
        .on('end', () => {
          source.cancel('Reached 633064 rows');
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  public async parseCvsToJsonFourthFile(url: string) {
    const csvToJson = new CsvToJsonFourthFile();

    const foo = (obj: Record<string, string>) => {
      let result: Partial<CardProductFourthFile> = {};
      result = csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      );

      const imageUrls = [];
      Object.keys(obj).forEach((key) => {
        if (key.startsWith('_') && !key.startsWith('_1')) {
          const url = obj[key].split(';')[0];
          if (url.startsWith('https://')) {
            imageUrls.push(url);
          }
        }
      });
      if (imageUrls.length > 0) {
        (result as any).url_photo_details = imageUrls.join(',');
      }
      return result as CardProductFourthFile;
    };
    const rows: CardProductFourthFile[] = [];
    const source = axios.CancelToken.source();

    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
      cancelToken: source.token,
    });

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(response.data);
      readableStream
        .pipe(csv())
        .on('data', (row) => {
          rows.push(foo(row));
        })
        .on('end', () => {
          source.cancel('Reached 633064 rows');
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  public async parseCvsToJsonFifthFile(url: string) {
    const csvToJson = new CsvToJsonFifthFile();

    const foo = (obj: Record<string, string>) => {
      let result: Partial<CardProductFifthFile> = {};
      result = csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      );
      return result as CardProductFifthFile;
    };
    const rows: CardProductFifthFile[] = [];
    const source = axios.CancelToken.source();

    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
      cancelToken: source.token,
    });

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(response.data);
      readableStream
        .pipe(csv())
        .on('data', (row) => {
          rows.push(foo(row));
        })
        .on('end', () => {
          source.cancel('Reached 633064 rows');
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
