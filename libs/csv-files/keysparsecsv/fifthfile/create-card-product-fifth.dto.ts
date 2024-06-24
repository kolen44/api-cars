import { CardProductFifthFile } from 'libs/csv-files/interface/fifthfile/csvfifth(104)';

export const cardProductFifthFileKeys: (keyof CardProductFifthFile)[] = [
  'article',
  'brand',
  'model',
  'year',
  'detail_name',
  'engine',
  'volume',
  'engine_type',
  'gearbox',
  'body_type',
  'original_number',
  'description',
  'price',
  'currency',
  'discount',
  'phone',
  'email',
  'url_car_video',
  'url_photo_details',
  'car',
  'new_arrival',
  'vin',
] as const;

// Массив, где хранятся только числовые ключи
export const cardProductFifthFileNumericKeys: (keyof CardProductFifthFile)[] = [
  'year',
  'discount',
  'volume',
] as const;
