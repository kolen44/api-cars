import { Inject, Injectable } from '@nestjs/common';
import { CsvToJson } from 'classes/csvtojson/csvtojson';
import * as csv from 'csv-parser';
import { CsvParser } from 'nest-csv-parser';
import { TableLine } from 'types/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import { createReadStream, writeFileSync } from 'fs';
import { lastValueFrom } from 'rxjs';
import { Readable } from 'stream';

@Injectable()
export class SparesCsvService {
  constructor(
    public csvParser: CsvParser,
    @Inject('billing') private sparesCsv: ClientProxy,
  ) {}

  public async cvsUpdate(file) {
    const results = [];
    return new Promise((resolve, reject) => {
      createReadStream(file.path)
        .pipe(csv())
        .on('data', (row) => {
          results.push(row);
          // console.log(row)
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
    await lastValueFrom(
      this.sparesCsv.emit('start', {
        message: 'тестовое сообщение микросервисов',
      }),
    );
    // const readStream = fs.createReadStream('data/spares.csv')

    // const writeStream = fs.createWriteStream('data/test.json')

    const csvToJson = new CsvToJson();

    const foo = (obj: Record<string, string>) => {
      let result: Partial<TableLine> = {};

      // value = value.replace(/"/g, '').split(';') as string[]
      result = csvToJson.createObjectByArray(
        Object.values(obj)[0].replace(/"/g, '').split(';'),
      );
      // console.log(value, '\n\n\n\n')

      return result as TableLine;
    };
    const rows: TableLine[] = [];
    const response = await axios.get(url);

    writeFileSync('./data/file.csv', `${response.data}`);

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(response.data);
      readableStream
        .pipe(csv())
        .on('data', (row) => {
          rows.push(foo(row));
          // console.log(row)
        })
        .on('end', () => {
          console.log(rows);
          console.log('Чтение CSV файла завершено');
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
