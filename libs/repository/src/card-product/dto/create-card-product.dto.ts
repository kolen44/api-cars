import { cardProductKeys } from '@repository/repository/card-product/card-product-keys';
import { CardProductDB } from '../types/card-product-db';

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
  public volume: string;
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
  public video?: string;
  public phone: string;
  public vin: string;

  constructor(params: CardProductDB) {
    cardProductKeys.forEach((key) => {
      if (key in params) {
        // Почему то не видит поля в классе
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[key] = params[key];
      }
    });
  }

  public getCreateData() {
    const createData: Partial<CardProductDB> = {};

    cardProductKeys.forEach((key) => {
      if (key in this) {
        // Тут тоже не робит :(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createData[key] = this[key];
      }
    });

    return createData as CardProductDB;
  }
}
