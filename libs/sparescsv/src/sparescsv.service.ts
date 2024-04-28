import { Injectable } from '@nestjs/common';
import { CsvToJson } from 'classes/csvtojson/csvtojson';
import * as csv from 'csv-parser';
import { CsvParser } from 'nest-csv-parser';
import { TableLine } from 'types/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { createReadStream } from 'fs';

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

  public async parseCvsToJson() {
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

    return new Promise((resolve, reject) => {
      createReadStream('data/spares.csv')
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
