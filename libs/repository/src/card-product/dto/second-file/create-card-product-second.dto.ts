import { CardProductSecondFile } from '@app/sparescsv/interface/cvssecond(101)';

export const cardProductSecondFileKeys: (keyof CardProductSecondFile)[] = [
  'article',
  'brand',
  'model',
  'year',
  'part',
  'fuel',
  'volume',
  'engine_type',
  'gearbox',
  'body_type',
  'number',
  'description',
  'price',
  'currency',
  'discount',
  'phones',
  'email',
  'url_car_video',
  'url_car_photo',
  'car',
  'new_arrival',
  'vin',
] as const;

// Массив, где хранятся только числовые ключи
export const cardProductSecondFileNumericKeys: (keyof CardProductSecondFile)[] =
  ['year', 'price', 'discount', 'volume'] as const;
