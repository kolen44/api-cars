import { CardProductSecondFile } from 'libs/interface/secondfile/cvssecond(101)';

export const cardProductSecondFileKeys: (keyof CardProductSecondFile)[] = [
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
export const cardProductSecondFileNumericKeys: (keyof CardProductSecondFile)[] =
  ['year', 'discount', 'volume'] as const;
