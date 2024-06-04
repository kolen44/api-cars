import { CardProduct } from '../../interface/firstfile/csvfirst(165)';

export const cardProductKeys: (keyof CardProduct)[] = [
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
  'url_car_video',
  'phone',
  'vin',
] as const;

// Массив, где хранятся только числовые ключи
export const cardProductNumericKeys: (keyof CardProduct)[] = [
  'in_stock',
  'price',
  'discount',
  'year_start_production',
  'year_end_production',
] as const;
