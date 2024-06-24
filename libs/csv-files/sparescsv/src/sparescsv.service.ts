import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as csv from 'csv-parser';
import { createReadStream } from 'fs';
import { CsvToJsonFirstFile } from 'libs/csv-files/classescsvtojson/firstfile/csvtojson.class';
import { CsvToJsonFourthFile } from 'libs/csv-files/classescsvtojson/fourthfile/csvtojson.class';
import { CsvToJsonThirdFile } from 'libs/csv-files/classescsvtojson/thirdfile/csvtojson.class';
import { CardProductFourthFile } from 'libs/csv-files/interface/fourthfile/csvfourth(103)';
import { CardProductThirdFile } from 'libs/csv-files/interface/thirdfile/csvthird(102)';
import { CsvParser } from 'nest-csv-parser';
import { Readable } from 'stream';
import { CsvToJsonSecondFile } from '../../classescsvtojson/secondfile/csvtojson.class';
import { CardProduct } from '../../interface/firstfile/csvfirst(165)';
import { CardProductSecondFile } from '../../interface/secondfile/cvssecond(101)';

@Injectable()
export class SparesCsvService {
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
    // const readStream = fs.createReadStream('data/spares.csv')

    // const writeStream = fs.createWriteStream('data/test.json')

    const csvToJson = new CsvToJsonFirstFile();

    const foo = (obj: Record<string, string>) => {
      let result: Partial<CardProduct> = {};

      // value = value.replace(/"/g, '').split(';') as string[]
      result = csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      );
      // console.log(value, '\n\n\n\n')

      return result as CardProduct;
    };
    const rows: CardProduct[] = [];
    const response = await axios.get(url);

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(response.data);
      readableStream
        .pipe(csv())
        .on('data', (row) => {
          rows.push(foo(row));
          // console.log(row)
        })
        .on('end', () => {
          //console.log(rows);
          //console.log('Чтение CSV файла завершено');
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  public async parseCvsToJsonSecondFile(
    url: string,
  ): Promise<CardProductSecondFile[]> {
    const csvToJson = new CsvToJsonSecondFile();

    const foo = (obj: Record<string, string>) => {
      let result: Partial<CardProductSecondFile> = {};
      result = csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      );
      return result as CardProductSecondFile;
    };

    const rows: CardProductSecondFile[] = [];
    console.log('spares.service 91 line');

    const response = await axios({
      method: 'get',
      url: url,
    });

    return new Promise((resolve, reject) => {
      response.data
        .pipe(csv())
        .on('data', (row) => {
          rows.push(foo(row));
        })
        .on('end', () => {
          resolve(rows);
        })
        .on('error', (error) => {
          console.log(error);
          reject(error);
        });
    });
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
    const response = await axios.get(url);

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(response.data);
      readableStream
        .pipe(csv())
        .on('data', (row) => {
          rows.push(foo(row));
        })
        .on('end', () => {
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
    const response = await axios.get(url);

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(response.data);
      readableStream
        .pipe(csv())
        .on('data', (row) => {
          rows.push(foo(row));
        })
        .on('end', () => {
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
