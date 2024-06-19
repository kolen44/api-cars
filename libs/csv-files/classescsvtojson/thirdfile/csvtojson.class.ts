import { CardProductThirdFile } from 'libs/csv-files/interface/thirdfile/csvthird(102)';
import {
  cardProductThirdFileKeys,
  cardProductThirdFileNumericKeys,
} from 'libs/csv-files/keysparsecsv/thirdfile/create-card-product-third.dto';

export class CsvToJsonThirdFile {
  public createObjectByArray(arr: string[]): CardProductThirdFile {
    const object = {};
    let index = 0;

    cardProductThirdFileKeys.forEach((key) => {
      const item = arr[index++];
      if (!item) return;

      let value: string | number;

      if (cardProductThirdFileNumericKeys.includes(key)) {
        value = Number.isNaN(Number(item)) ? item : Number(item);
      } else {
        value = item;
      }
      object[key] = value;
    });

    return object as CardProductThirdFile;
  }

  public convertLine(line: string): CardProductThirdFile {
    const arr = line.replace(/"/g, '').split(';');
    return this.createObjectByArray(arr);
  }

  public convertFullFile(text: string) {
    return text.split('"\r\n').map((line) => this.convertLine(line));
  }
}
