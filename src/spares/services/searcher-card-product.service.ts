import { Injectable } from '@nestjs/common';
import { CardProductService } from '@repository/repository';
import { FindCardProduct } from '../classes/test.class';
import { FindProductQueryDto } from '../dto/find-product-query.dto';

@Injectable()
export class SearcherCardProductService {
  constructor(private readonly cardProductService: CardProductService) {}

  public async search(query: FindProductQueryDto) {
    const { brand, model, engine, volume, year, year_start, year_end } = query;

    const findCardProduct = new FindCardProduct(this.cardProductService);

    if (brand) {
      findCardProduct.andWhereBrand(brand);
    }
    if (model) {
      findCardProduct.andWhereModel(model);
    }
    if (engine) {
      findCardProduct.andWhereEngine(engine);
    }
    if (volume) {
      findCardProduct.andWhereVolume(volume);
    }

    if (year_start && year_end) {
      findCardProduct.andWhereIntervalYear(year_start, year_end);
    } else if (year) {
      findCardProduct.andWhereOneYear(year);
    }

    // Нужно очистить поля от null

    return findCardProduct;
  }
}
