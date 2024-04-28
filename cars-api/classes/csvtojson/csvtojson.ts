import { TableLine } from 'types/types';

export class CsvToJson {
  public createObjectByArray(arr: string[]): TableLine {
    const object = {};
    let index = 0;

    const keys = [
      'article',
      'in_stock',
      'detail_name',
      'included_in_unit',
      'brand',
      'model',
      'version',
      'body_type',
      'year',
      'engine',
      'volume',
      'engine_type',
      'gearbox',
      'original_number',
      'price',
      'for_naked',
      'currency',
      'discount',
      'description',
      'year_start_production',
      'year_end_production',
      'url_photo_details',
      'url_car_photo',
      'video',
      'phone',
      'vin',
    ] as (keyof TableLine)[];

    const numberKeys = [
      'in_stock',
      'version',
      'year',
      'price',
      'discount',
      'year_start_production',
      'year_end_production',
    ] as (keyof TableLine)[];

    keys.forEach((key) => {
      const item = arr[index++];
      if (!item) return;

      if (numberKeys.includes(key)) {
        try {
          object[key] = +item as unknown as undefined;
          return;
        } catch (err) {}
      }
      object[key] = item as unknown as undefined;
    });

    return object as TableLine;
  }

  public lineToTableLine(line: string): TableLine {
    const arr = line.replace(/"/g, '').split(';');
    return this.createObjectByArray(arr);
  }

  public convert(text: string) {
    return text
      .split('"\r\n')
      .slice(1)
      .map((line) => this.lineToTableLine(line))
      .slice(undefined, 1000);
  }
}
