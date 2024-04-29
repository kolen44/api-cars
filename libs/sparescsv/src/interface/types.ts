// Главный интерфейс по файлу spares.csv

export interface CardProduct {
  article: string;
  in_stock: number;
  detail_name: string;
  included_in_unit?: string;
  brand: string;
  model: string;
  version?: string;
  body_type?: string;
  year?: number;
  engine: string;
  volume: string;
  engine_type?: string;
  gearbox: string;
  original_number?: string;
  price: number;
  for_naked?: string;
  currency: string;
  discount: number;
  description: string;
  year_start_production: number;
  year_end_production: number;
  url_photo_details: string;
  url_car_photo?: string;
  video?: string;
  phone: string;
  vin?: string;
}
