import { cardProductFourthFileKeys } from 'libs/csv-files/keysparsecsv/fourthfile/card-product-fourth.dto.';
import { CardProductFourthFileDB } from 'libs/csv-files/keysparsecsv/fourthfile/types/card-product-db-fourth';

export class UpdateCardProductFourthFIleDto
  implements Partial<CardProductFourthFileDB>
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
  public address: string;
  public url_photo_details: string;
  public on_order: string;
  public new: string;
  public video: string;
  public r_diameter: number;
  public j_width: number;
  public holes_number: number;
  public et_offset: number;
  public dia: number;
  public pcd: string;

  constructor(params: Partial<CardProductFourthFileDB>) {
    (cardProductFourthFileKeys as (keyof CardProductFourthFileDB)[]).forEach(
      (key) => {
        if (key in params) {
          if (key === 'volume' && Number(params[key]) > 1000) {
            this.volume = Number(params[key]) / 1000;
          }
          if (key === 'price' && typeof params[key] === 'string') {
            this.price = parseFloat(
              (params[key] as unknown as string).replace(',', '.'),
            );
          } else if (key === 'volume' && typeof params[key] === 'string') {
            this.volume = parseFloat(
              (params[key] as unknown as string).replace(',', '.'),
            );
          } else {
            this[key as string] = params[key] as keyof CardProductFourthFileDB;
          }
        }
      },
    );
  }

  public getUpdateData() {
    const updateData: Partial<CardProductFourthFileDB> = {};

    cardProductFourthFileKeys.forEach((key) => {
      if (key in this && !!this[key]) {
        updateData[key as string] = this[key];
      }
    });

    return updateData as CardProductFourthFileDB;
  }
}
