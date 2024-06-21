import { CardProductFourthFile } from 'libs/csv-files/interface/fourthfile/csvfourth(103)';

export const cardProductFourthFileKeys: (keyof CardProductFourthFile)[] = [
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
  'address',
  'url_photo_details',
  'on_order',
  'new',
  'video',
  'r_diameter',
  'j_width',
  'holes_number',
  'et_offset',
  'dia',
  'pcd',
] as const;

// Массив, где хранятся только числовые ключи
export const cardProductFourthFileNumericKeys: (keyof CardProductFourthFile)[] =
  ['year', 'discount', 'volume', 'price'] as const;
