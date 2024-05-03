import { CardProductService } from '@repository/repository';
import { CardProduct } from 'src/database/entities/product.entity';
import { SelectQueryBuilder } from 'typeorm';

export class FindCardProduct {
  private queryBuilder: SelectQueryBuilder<CardProduct>;

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
    return this.andWhere(this.toLowerCaseWithLike('brand', 'brand'), {
      brand: `%${brand}%`,
    });
    return this;
  }

  public andWhereModel(model: string) {
    return this.andWhere(this.toLowerCaseWithLike('model', 'model'), {
      model: `%${model}%`,
    });
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
    return this.andWhere(getQueryForYearInterval(), { year_start, year_end });
  }

  public andWhereOneYear(year: number) {
    const query =
      '(product.year_start_production <= :year AND product.year_end_production >= :year)';

    return this.andWhere(query, { year });
  }

  public andWhereEngine(engine: string) {
    return this.andWhere(this.toLowerCaseWithLike('engine', 'engine'), {
      engine: `%${engine}%`,
    });
  }

  public andWhereVolume(volume: number) {
    return this.andWhere('product.volume = :volume', {
      volume,
    });
  }

  public andWhereDetailNames(detail_names: string[]) {
    const generateDetailNameKey = (index: number) => {
      return `detail_names_${index}`;
    };

    const conditions = detail_names.map((detail_name, index) =>
      this.toLowerCaseWithLike('detail_name', generateDetailNameKey(index)),
    );

    const query = conditions.join(' OR ');

    const values_of_detail_names: Record<string, string> = {};

    detail_names.forEach(
      (detail_name, index) =>
        (values_of_detail_names[generateDetailNameKey(index)] =
          `%${detail_name}%`),
      {},
    );

    return this.andWhere(`(${query})`, values_of_detail_names);
  }

  private toLowerCaseWithLike(attribute: string, query: string) {
    return `(LOWER(product.${attribute}) LIKE LOWER(:${query || attribute}))`;
  }

  private andWhere(where: string, values: Record<string, unknown>) {
    this.queryBuilder.andWhere(where, values);
    return this;
  }
}
