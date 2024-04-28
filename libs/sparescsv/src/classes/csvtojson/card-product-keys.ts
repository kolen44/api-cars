import { CardProduct } from '@sparescsv/sparescsv/classes/csvtojson/types'

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
  'video',
  'phone',
  'vin',
]

type CardProductNumericKeys = {
  [key in keyof CardProduct]: CardProduct[key] extends number ? key : never
}

// Эта тема нужно что бы нельзя было просто так подставить любую строку
// Нужно сначала в типе CardProduct поменять поле, а потом уже добавлять в этот массив
// Этот массив потом нужен для определения строк и чисел в spares.csv
type NumericKeys = CardProductNumericKeys[keyof CardProduct]

export const cardProductNumericKeys: NumericKeys[] = [
  'in_stock',
  'price',
  'discount',
  'year_start_production',
  'year_end_production',
]
