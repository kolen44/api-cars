import { Injectable } from '@nestjs/common';
import { CsvToJson } from 'classes/csvtojson/csvtojson';
import csv from 'csv-parser';
import fs from 'fs';
import { CsvParser } from 'nest-csv-parser';
import { TableLine } from 'types/types';

@Injectable()
export class SparesCsvService {
  constructor(public csvParser: CsvParser) {}

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
    fs.createReadStream('data/spares.csv')
      .pipe(csv())
      .on('data', (row) => {
        rows.push(foo(row));
        // console.log(row)
      })
      .on('end', () => {
        console.log(rows);
        console.log('Чтение CSV файла завершено');
      });
  }
}
