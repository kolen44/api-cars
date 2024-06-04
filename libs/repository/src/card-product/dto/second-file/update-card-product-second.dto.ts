import { CardProductSecondFileDB } from '../../types/card-product-db-second';
import { cardProductSecondFileKeys } from './create-card-product-second.dto';

export class UpdateCardProductSecondFIleDto
  implements Partial<CardProductSecondFileDB>
{
  public id_ext: string;
  public brand: string;
  public model: string;
  public year: number;
  public part: string;
  public fuel: string;
  public volume: number;
  public engine_type: string;
  public gearbox: string;
  public body_type: string;
  public number: string;
  public description: string;
  public price: number;
  public currency: string;
  public discount: number;
  public phones: string;
  public email?: string;
  public url_car_video?: string;
  public url_car_photo?: string;
  public car?: string;
  public new_arrival?: string;
  public vin?: string;

  constructor(params: Partial<CardProductSecondFileDB>) {
    (cardProductSecondFileKeys as (keyof CardProductSecondFileDB)[]).forEach(
      (key) => {
        if (key in params) {
          this[key as string] = params[key] as keyof CardProductSecondFileDB;
        }
      },
    );
  }

  public getUpdateData() {
    const updateData: Partial<CardProductSecondFileDB> = {};

    cardProductSecondFileKeys.forEach((key) => {
      if (key in this && !!this[key]) {
        updateData[key as string] = this[key];
      }
    });

    return updateData as CardProductSecondFileDB;
  }
}
