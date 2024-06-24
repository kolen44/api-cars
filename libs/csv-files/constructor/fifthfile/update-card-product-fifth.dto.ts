import { cardProductFifthFileKeys } from 'libs/csv-files/keysparsecsv/fifthfile/create-card-product-fifth.dto';
import { CardProductFifthFileDB } from 'libs/csv-files/keysparsecsv/fifthfile/types/card-product-db-fifth';

export class UpdateCardProductFifthFIleDto
  implements Partial<CardProductFifthFileDB>
{
  public article: string;
  public brand: string;
  public model: string;
  public year: number;
  public detail_name: string;
  public engine: string;
  public volume: number;
  public engine_type: string;
  public gearbox: string;
  public body_type: string;
  public original_number: string;
  public description: string;
  public price: number;
  public currency: string;
  public discount: number;
  public phone: string;
  public email?: string;
  public url_car_video?: string;
  public url_photo_details?: string;
  public car?: string;
  public new_arrival?: string;
  public vin?: string;

  constructor(params: Partial<CardProductFifthFileDB>) {
    (cardProductFifthFileKeys as (keyof CardProductFifthFileDB)[]).forEach(
      (key) => {
        if (key in params) {
          if (key === 'price' && typeof params[key] === 'string') {
            this.price = parseFloat(
              (params[key] as unknown as string).replace(',', '.'),
            );
          } else if (key === 'volume' && typeof params[key] === 'string') {
            this.volume = parseFloat(
              (params[key] as unknown as string).replace(',', '.'),
            );
          } else {
            this[key as string] = params[key] as keyof CardProductFifthFileDB;
          }
        }
      },
    );
  }

  public getUpdateData() {
    const updateData: Partial<CardProductFifthFileDB> = {};

    cardProductFifthFileKeys.forEach((key) => {
      if (key in this && !!this[key]) {
        updateData[key as string] = this[key];
      }
    });

    return updateData as CardProductFifthFileDB;
  }
}
