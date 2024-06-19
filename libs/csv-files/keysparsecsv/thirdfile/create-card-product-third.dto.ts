import { CardProductThirdFile } from 'libs/csv-files/interface/thirdfile/csvthird(102)';

export const cardProductThirdFileKeys: (keyof CardProductThirdFile)[] = [
  'brand',
  'model',
  'year',
  'volume',
  'engine',
  'engine_type',
  'gearbox',
  'body_type',
  'detail_name',
  'original_number',
  'description',
  'price',
  'currency',
  'no_save_db0',
  'url_photo_details',
  'discount',
  'new_arrival',
  'phone',
  'version',
  'no_save_db1',
  'no_save_db2',
  'no_save_db3',
  'no_save_db4',
  'no_save_db5',
  'no_save_db6',
  'no_save_db7',
  'video',
  'no_save_db8',
  'no_save_db9',
  'vin',
] as const;

// Массив, где хранятся только числовые ключи
export const cardProductThirdFileNumericKeys: (keyof CardProductThirdFile)[] = [
  'year',
  'volume',
  'price',
  'discount',
] as const;
