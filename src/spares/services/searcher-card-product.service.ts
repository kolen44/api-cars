import { Injectable } from '@nestjs/common';
import { CardProductService } from '@repository/repository';
import { FindCardProduct } from '../classes/find-card-product.class';
import { FindProductQueryDto } from '../dto/find-product-query.dto';

@Injectable()
export class SearcherCardProductService {
  constructor(private readonly cardProductService: CardProductService) {}

  public async search(query: FindProductQueryDto) {
    const findCardProduct = new FindCardProduct(this.cardProductService);

    if (query.article) {
      findCardProduct.andWhereArticle(query.article);
    }
    if (query.brand) {
      findCardProduct.andWhereBrand(query.brand);
    }
    if (query.model) {
      findCardProduct.andWhereModel(query.model);
    }
    if (query.engine) {
      findCardProduct.andWhereEngine(query.engine);
    }
    if (query.volume) {
      findCardProduct.andWhereVolume(query.volume);
    }
    if (query.detail_names) {
      findCardProduct.andWhereDetailNames(query.detail_names);
    }

    if (query.year_start && query.year_end) {
      findCardProduct.andWhereIntervalYear(query.year_start, query.year_end);
    } else if (query.year) {
      findCardProduct.andWhereOneYear(query.year);
    }

    // Нужно очистить поля от null

    return findCardProduct;
  }
}
