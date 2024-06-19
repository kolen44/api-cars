import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as csv from 'csv-parser';
import { createReadStream } from 'fs';
import { CsvToJsonFirstFile } from 'libs/csv-files/classescsvtojson/firstfile/csvtojson.class';
import { CsvToJsonThirdFile } from 'libs/csv-files/classescsvtojson/thirdfile/csvtojson.class';
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

  public async parseCvsToJsonSecondFile(url: string) {
    // const readStream = fs.createReadStream('data/spares.csv')

    // const writeStream = fs.createWriteStream('data/test.json')

    const csvToJson = new CsvToJsonSecondFile();

    const foo = (obj: Record<string, string>) => {
      let result: Partial<CardProductSecondFile> = {};

      // value = value.replace(/"/g, '').split(';') as string[]
      result = csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      );
      // console.log(value, '\n\n\n\n')

      return result as CardProductSecondFile;
    };
    const rows: CardProductSecondFile[] = [];
    console.log('beign');
    const response = await axios.get(url);
    console.log('end');

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

  public async parseCvsToJsonThirdFile(url: string) {
    const csvToJson = new CsvToJsonThirdFile();

    const foo = (obj: Record<string, string>) => {
      let result: Partial<CardProductThirdFile> = {};

      // value = value.replace(/"/g, '').split(';') as string[]
      result = csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      );
      // console.log(value, '\n\n\n\n')

      return result as CardProductThirdFile;
    };
    const rows: CardProductThirdFile[] = [];
    console.log('beign');
    const response = await axios.get(url);
    console.log('end');

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(response.data);
      readableStream
        .pipe(csv())
        .on('data', (row) => {
          rows.push(foo(row));
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
}
