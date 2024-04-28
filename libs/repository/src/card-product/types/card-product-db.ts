import { CardProduct } from '@sparescsv/sparescsv/classes/csvtojson/types'

export type CardProductDBWithoutKeys = Omit<CardProduct, 'year'>

export type CardProductDB = {
  [key in keyof CardProductDBWithoutKeys]: key extends keyof CardProductDBWithoutKeys
    ? CardProduct[key]
    : never
}

const object: CardProductDB = {
  article: '1',
  in_stock: 1,
  detail_name: '2',
  included_in_unit: '3',
  brand: '4',
  model: '5',
  version: '6',
  body_type: '7',
  engine: '9',
  volume: '10',
  engine_type: '11',
  gearbox: '12',
  original_number: '13',
  price: 14,
  for_naked: '15',
  currency: '16',
  discount: 17,
  description: '18',
  year_start_production: 19,
  year_end_production: 20,
  url_photo_details: '21',
  url_car_photo: '22',
  video: '23',
  phone: '24',
  vin: '25',
}
