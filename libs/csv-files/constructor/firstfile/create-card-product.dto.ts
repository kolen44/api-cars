import { cardProductKeys } from 'libs/csv-files/keysparsecsv/firstfile/card-product-keys';
import { CardProductDB } from '../../keysparsecsv/firstfile/types/card-product-db';

export class CreateCardProductDto {
  public article: string;
  public in_stock: number;
  public detail_name: string;
  public included_in_unit?: string;
  public brand: string;
  public model: string;
  public version: string;
  public body_type: string;
  public engine: string;
  public volume: number;
  public engine_type?: string;
  public gearbox: string;
  public original_number?: string;
  public price: number;
  public for_naked?: string;
  public currency: string;
  public discount: number;
  public description: string;
  public year_start_production: number;
  public year_end_production: number;
  public url_photo_details: string;
  public url_car_photo: string;
  public url_car_video?: string;
  public phone: string;
  public vin: string;

  constructor(params: CardProductDB) {
    cardProductKeys.forEach((key) => {
      if (key in params) {
        this[key as string] = params[key];
      }
    });
  }

  public getCreateData() {
    const createData: Partial<CardProductDB> = {};

    cardProductKeys.forEach((key) => {
      if (key in this) {
        createData[key as string] = this[key];
      }
    });

    return createData as CardProductDB;
  }
}
