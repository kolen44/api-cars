import { CardProductService } from '@repository/repository';

export class FindCardProduct {
  private queryBuilder: any;

  constructor(cardProductService: CardProductService) {
    this.queryBuilder = cardProductService.getQueryBuilder();
  }

  public async getMany({ skip, limit }: { skip: number; limit: number }) {
    return await this.queryBuilder
      .skip(skip || 0)
      .take(limit || 20)
      .getMany();
  }

  public andWhereBrand(brand: string) {
    this.queryBuilder.andWhere('(LOWER(product.brand) LIKE LOWER(:brand))', {
      brand: `%${brand}%`,
    });
    return this;
  }

  public andWhereModel(model: string) {
    this.queryBuilder.andWhere('(LOWER(product.model) LIKE LOWER(:model))', {
      model: `%${model}%`,
    });
    return this;
  }

  public andWhereIntervalYear(year_start: number, year_end: number) {
    const getQueryForYearInterval = () => {
      return `
        (
          (product.year_start_production >= :year_start
          AND 
          product.year_start_production <= :year_end)
          
          OR 

          (product.year_end_production >= :year_start 
          AND
          product.year_end_production <= :year_end)
        )
      `;
    };
    this.queryBuilder.andWhere(getQueryForYearInterval(), {
      year_start,
      year_end,
    });
    return this;
  }

  public andWhereOneYear(year: number) {
    const getQueryForOneYear = () => {
      return '(product.year_start_production <= :year AND product.year_end_production >= :year)';
    };
    this.queryBuilder.andWhere(getQueryForOneYear(), {
      year,
    });
    return this;
  }

  public andWhereEngine(engine: string) {
    this.queryBuilder.andWhere('(LOWER(product.engine) LIKE LOWER(:engine))', {
      engine: `%${engine}%`,
    });
    return this;
  }

  public andWhereVolume(volume: number) {
    this.queryBuilder.andWhere('product.volume = :volume', {
      volume,
    });
    return this;
  }
}
