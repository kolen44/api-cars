import { CardProductFourthFile } from 'libs/csv-files/interface/fourthfile/csvfourth(103)';
import {
  cardProductFourthFileKeys,
  cardProductFourthFileNumericKeys,
} from 'libs/csv-files/keysparsecsv/fourthfile/card-product-fourth.dto.';

export class CsvToJsonFourthFile {
  public createObjectByArray(arr: string[]): CardProductFourthFile {
    const object = {};
    let index = 0;

    cardProductFourthFileKeys.forEach((key) => {
      const item = arr[index++];
      if (!item) return;

      let value: string | number;

      if (cardProductFourthFileNumericKeys.includes(key)) {
        value = Number.isNaN(Number(item)) ? item : Number(item);
      } else {
        value = item;
      }
      object[key] = value;
    });

    return object as CardProductFourthFile;
  }

  public convertLine(line: string): CardProductFourthFile {
    const arr = line.replace(/"/g, '').split(';');
    return this.createObjectByArray(arr);
  }

  public convertFullFile(text: string) {
    return text.split('"\r\n').map((line) => this.convertLine(line));
  }
}
