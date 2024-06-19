import { cardProductThirdFileKeys } from 'libs/csv-files/keysparsecsv/thirdfile/create-card-product-third.dto';
import { CardProductThirdFileDB } from 'libs/csv-files/keysparsecsv/thirdfile/types/card-product-db-third';

export class UpdateCardProductThirdFIleDto
  implements Partial<CardProductThirdFileDB>
{
  public brand: string;
  public model: string;
  public year: number;
  public volume: number;
  public engine: string;
  public engine_type: string;
  public gearbox: string;
  public body_type: string;
  public detail_name: string;
  public original_number: string;
  public description: string;
  public price: number;
  public currency: string;
  public no_save_db0: string;
  public url_photo_details?: string;
  public discount: number;
  public new_arrival?: string;
  public phone: string;
  public version?: string;
  public no_save_db1: string;
  public no_save_db2: string;
  public no_save_db3: string;
  public no_save_db4: string;
  public no_save_db5: string;
  public no_save_db6: string;
  public no_save_db7: string;
  public video: string;
  public no_save_db8: string;
  public no_save_db9: string;
  public vin: string;

  constructor(params: Partial<CardProductThirdFileDB>) {
    (cardProductThirdFileKeys as (keyof CardProductThirdFileDB)[]).forEach(
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
            if (this.volume > 1000) {
              this.volume = this.volume / 1000;
            }
          } else {
            this[key as string] = params[key] as keyof CardProductThirdFileDB;
          }
        }
      },
    );
  }

  public getUpdateData() {
    const updateData: Partial<CardProductThirdFileDB> = {};

    cardProductThirdFileKeys.forEach((key) => {
      if (key in this && !!this[key]) {
        updateData[key as string] = this[key];
      }
    });

    return updateData as CardProductThirdFileDB;
  }
}
