import { CardProductFifthFile } from 'libs/csv-files/interface/fifthfile/csvfifth(104)';
import {
  cardProductFifthFileKeys,
  cardProductFifthFileNumericKeys,
} from 'libs/csv-files/keysparsecsv/fifthfile/create-card-product-fifth.dto';

export class CsvToJsonFifthFile {
  public createObjectByArray(arr: string[]): CardProductFifthFile {
    const object = {};
    let index = 0;

    cardProductFifthFileKeys.forEach((key) => {
      const item = arr[index++];
      if (!item) return;

      let value: string | number;

      if (cardProductFifthFileNumericKeys.includes(key)) {
        value = Number.isNaN(Number(item)) ? item : Number(item);
      } else {
        value = item;
      }
      object[key] = value;
    });

    return object as CardProductFifthFile;
  }

  public convertLine(line: string): CardProductFifthFile {
    const arr = line.replace(/"/g, '').split(';');
    return this.createObjectByArray(arr);
  }

  public convertFullFile(text: string) {
    return text.split('"\r\n').map((line) => this.convertLine(line));
  }
}
