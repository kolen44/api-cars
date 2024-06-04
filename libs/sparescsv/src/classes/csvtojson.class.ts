import {
  cardProductSecondFileKeys,
  cardProductSecondFileNumericKeys,
} from '@repository/repository/card-product/dto/second-file/create-card-product-second.dto';
import { CardProductSecondFile } from '../interface/cvssecond(101)';

export class CsvToJson {
  public createObjectByArray(arr: string[]): CardProductSecondFile {
    const object = {};
    let index = 0;

    cardProductSecondFileKeys.forEach((key) => {
      const item = arr[index++];
      if (!item) return;

      let value: string | number;

      if (cardProductSecondFileNumericKeys.includes(key)) {
        value = Number.isNaN(Number(item)) ? item : Number(item);
      } else {
        value = item;
      }
      object[key] = value;
    });

    return object as CardProductSecondFile;
  }

  public convertLine(line: string): CardProductSecondFile {
    const arr = line.replace(/"/g, '').split(';');
    return this.createObjectByArray(arr);
  }

  public convertFullFile(text: string) {
    return text.split('"\r\n').map((line) => this.convertLine(line));
  }
}
