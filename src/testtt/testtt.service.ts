import { SparesCsvService } from '@app/sparescsv';
import { CsvToJson } from '@app/sparescsv/classes/csvtojson.class';
import { CardProduct } from '@app/sparescsv/interface/types';
import { Injectable } from '@nestjs/common';
import { CardProductService } from '@repository/repository/card-product/card-product.service';
import { CreateCardProductDto } from '@repository/repository/card-product/dto/create-card-product.dto';
import { UpdateCardProductDto } from '@repository/repository/card-product/dto/update-card-product.dto';
import { CardProductDB } from '@repository/repository/card-product/types/card-product-db';
import console from 'console';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { FindTestttDto } from './dto/find-testtt.dto';

@Injectable()
export class TestttService {
  constructor(
    private readonly sparesService: SparesCsvService,
    private readonly cardProductService: CardProductService,
  ) {}

  async getProduct(query: FindTestttDto) {
    const { page, limit, brand, model, year, year_start, year_end } = query;
    const skip = (page - 1) * limit;

    let queryBuilder = this.cardProductService.getQueryBuilder();

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

    const getQueryForOneYear = () => {
      return '(product.year_start_production <= :year AND product.year_end_production >= :year)';
    };

    if (brand) {
      queryBuilder = queryBuilder.andWhere('product.brand = :brand', { brand });
    }
    if (model) {
      queryBuilder = queryBuilder.andWhere('product.model = :model', { model });
    }

    if (year_start && year_end) {
      queryBuilder = queryBuilder.andWhere(getQueryForYearInterval(), {
        year_start,
        year_end,
      });
    } else if (year) {
      queryBuilder = queryBuilder.andWhere(getQueryForOneYear(), { year });
    }

    const result = await queryBuilder.skip(skip).take(limit).getMany();

    return { page, limit, search_count: result.length, data: result };
  }

  // REFACTOR Это потом удалим
  async downloadDatabase() {
    const handleStream = async (rows: CardProductDB[]) => {
      console.log('перед бд');

      // for (let i = 0; i < rows.length; i++) {
      //   const row = rows[i];

      //   if (row.year_start_production === 0) {
      //     row.year_start_production = 2023;
      //   } else if (row.year_end_production - row.year_start_production > 9) {
      //     row.year_start_production = row.year_end_production + 9;
      //   }

      //   if (i % 10 === 0) console.log('i', i);

      //   const createCardProductDto = new CreateCardProductDto(row);

      //   const error = await this.cardProductService
      //     .create(createCardProductDto)
      //     .then(() => {
      //       console.log(`строка с артиклем ${row.article} прошла в бд`);
      //       return false;
      //     })
      //     .catch(() => {
      //       console.log(
      //         `ERROR: строка с артиклем ${row.article} не прошла в бд`,
      //       );
      //       return true;
      //     });

      //   if (error) break;
      // }

      const promises = rows.map(async (row, index) => {
        if (row.year_end_production < 1900) {
          row.year_end_production = 2023;
        } else if (row.year_end_production - row.year_start_production > 9) {
          row.year_end_production = row.year_start_production + 9;
        }

        if (index % 10 === 0) {
          console.log('index', index);
        }

        const createCardProductDto = new CreateCardProductDto(row);

        await this.cardProductService
          .create(createCardProductDto)
          // .then(() => {
          //   console.log(`строка с артиклем ${row.article} прошла в бд`);
          // })
          .catch(() => {
            console.log(
              `ERROR: строка с артиклем ${row.article} не прошла в бд`,
            );
          });
      });

      await Promise.all(promises);
    };

    const parseCsvToJson = () => {
      const convertRow = (obj: Record<string, string>) => {
        let result: Partial<CardProduct> = {};
        const csvToJson = new CsvToJson();

        result = csvToJson.createObjectByArray(
          Object.values(obj)[0].replace(/"/g, '').split(';'),
        );

        return result as CardProduct;
      };

      return new Promise((resolve, reject) => {
        const rows: CardProduct[] = [];

        return fs
          .createReadStream('data/spares.csv')
          .pipe(csv())
          .on('data', (row) => {
            rows.push(convertRow(row));
          })
          .on('end', () => {
            resolve(rows);
            console.log('Чтение CSV файла завершено');
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    };

    await parseCsvToJson()
      .then(async (rows) => {
        console.log('После парсинга CSV-файла');
        console.time('createInDatabase');
        await handleStream(rows as CardProductDB[]);
        console.log('после загрузки в бд');
        console.timeEnd('createInDatabase');
      })
      .catch((error) => {
        console.error('Произошла ошибка:', error);
      });
  }

  async test() {
    const article = '3TD01J301';
    const updateCardProductDto = new UpdateCardProductDto({
      year_start_production: 2012,
      year_end_production: null,
      model: undefined,
    });
    return await this.cardProductService.updateByArticle(
      article,
      updateCardProductDto,
    );
  }
}
