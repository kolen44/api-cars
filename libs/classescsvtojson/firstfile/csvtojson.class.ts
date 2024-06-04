import {
  cardProductKeys,
  cardProductNumericKeys,
} from 'libs/keysparsecsv/firstfile/card-product-keys';
import { CardProduct } from 'src/database/entities/product.entity';

export class CsvToJsonFirstFile {
  public createObjectByArray(arr: string[]): CardProduct {
    const object = {};
    let index = 0;

    cardProductKeys.forEach((key) => {
      const item = arr[index++];
      if (!item) return;

      let value: string | number;

      if (cardProductNumericKeys.includes(key)) {
        value = Number.isNaN(Number(item)) ? item : Number(item);
      } else {
        value = item;
      }
      object[key] = value;
    });

    return object as CardProduct;
  }

  public convertLine(line: string): CardProduct {
    const arr = line.replace(/"/g, '').split(';');
    return this.createObjectByArray(arr);
  }

  public convertFullFile(text: string) {
    return text.split('"\r\n').map((line) => this.convertLine(line));
  }
}
