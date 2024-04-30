import { SparesCsvService } from '@app/sparescsv';
import { CardProduct } from '@app/sparescsv/interface/types';
import { Injectable, Logger } from '@nestjs/common';
import { CardProductService } from '@repository/repository/card-product/card-product.service';
import { CreateCardProductDto } from '@repository/repository/card-product/dto/create-card-product.dto';
import { UpdateCardProductDto } from '@repository/repository/card-product/dto/update-card-product.dto';
import { CardProductDB } from '@repository/repository/card-product/types/card-product-db';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { FindTestttDto } from './dto/find-testtt.dto';

@Injectable()
export class TestttService {
  private readonly logger = new Logger(TestttService.name);

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
      this.logger.log('перед бд');

      // for (let i = 0; i < rows.length; i++) {
      //   const row = rows[i];

      //   if (row.year_end_production < 1900) {
      //     row.year_end_production = 2023;
      //   } else if (row.year_end_production - row.year_start_production > 9) {
      //     row.year_end_production = row.year_start_production + 9;
      //   }

      //   if (i % 10 === 0) console.log('i', i);

      //   const createCardProductDto = new CreateCardProductDto(row);

      //   const error = await this.cardProductService
      //     .create(createCardProductDto)
      //     .then(() => {
      //       console.log(`строка с артиклем ${row.article} прошла в бд`);
      //       return false;
      //     })
      //     .catch((err) => {
      //       console.log(
      //         `ERROR: строка с артиклем ${row.article} не прошла в бд`,
      //         err,
      //       );
      //       return true;
      //     });

      //   if (error) break;
      // }

      const createsDto = rows.map((row, index) => {
        if (row.year_end_production < 1900) {
          row.year_end_production = 2023;
        } else if (row.year_end_production - row.year_start_production > 9) {
          row.year_end_production = row.year_start_production + 9;
        }

        // if (index % 10 === 0) {
        //   this.logger.log(`index ${index}`);
        // }

        const createCardProductDto = new CreateCardProductDto(row);

        return createCardProductDto;

        // await this.cardProductService
        //   .create(createCardProductDto)
        //   // .then(() => {
        //   //   this.logger.log(`строка с артиклем ${row.article} прошла в бд`);
        //   // })
        //   .catch((err) => {
        //     this.logger.log(
        //       `ERROR: строка с артиклем ${row.article} не прошла в бд`,
        //       err,
        //     );
        //   });
      });

      this.logger.log(`Обработаны все данные для бд`);

      const max = 2500;

      for (let i = 0; i < createsDto.length; i += max) {
        if (i % max === 0) {
          await this.cardProductService.createMany(
            createsDto.slice(i, i + max),
          );
        }
      }

      // return await this.cardProductService.createMany(createsDtpResult);

      // await Promise.all(fs.promises);
    };

    const parseCsvToJson = () => {
      const convertRow = (obj: Record<string, string>) => {
        const toNumber = (num: string | number | undefined) => {
          if (!num) return undefined;
          return Number.isNaN(Number(num)) ? undefined : Number(num);
        };

        const convertString = (val: string) => {
          return !!val ? val : undefined;
        };

        const result: CardProduct = {
          article: convertString(obj['Артикул']),
          in_stock: toNumber(obj['В наличии']),
          detail_name: convertString(obj['Наименование детали']),
          included_in_unit: convertString(obj['В составе агрегата']),
          brand: convertString(obj['Марка']),
          model: convertString(obj['Модель']),
          version: convertString(obj['Версия']),
          body_type: convertString(obj['Тип кузова']),
          year: toNumber(obj['Год']),
          engine: convertString(obj['Двигатель']),
          volume: convertString(obj['Объем']),
          engine_type: convertString(obj['Тип ДВС']),
          gearbox: convertString(obj['КПП']),
          original_number: convertString(obj['Оригинальный номер']),
          price: toNumber(obj['Цена']),
          for_naked: convertString(obj['За голую']),
          currency: convertString(obj['Валюта']),
          discount: toNumber(obj['Скидка']),
          description: convertString(obj['Описание']),
          year_start_production: toNumber(obj['Год начала выпуска']),
          year_end_production: toNumber(obj['Год окончания выпуска']),
          url_photo_details: convertString(obj['URL фото детали']),
          url_car_photo: convertString(obj['URL фото автомобиля']),
          video: convertString(obj['Видео']),
          phone: convertString(obj['Телефон']),
          vin: convertString(obj['VIN']),
        } as CardProduct;

        return result;

        // result = csvToJson.createObjectByArray(
        //   Object.values(obj)[0].split('";"'),
        // );

        // console.log(obj);

        // return result as CardProduct;
      };

      return new Promise((resolve, reject) => {
        const rows: CardProduct[] = [];

        return fs
          .createReadStream('data/spares.csv')
          .pipe(csv({ separator: ';' }))
          .on('data', (row) => {
            rows.push(convertRow(row));
          })
          .on('end', () => {
            resolve(rows);
            this.logger.log('Чтение CSV файла завершено');
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    };

    await parseCsvToJson()
      .then(async (rows) => {
        this.logger.log('После парсинга CSV-файла');
        // console.time('createInDatabase');
        await handleStream(rows as CardProductDB[]);
        this.logger.log('после загрузки в бд');
        // console.timeEnd('createInDatabase');
      })
      .catch((error) => {
        this.logger.error('Произошла ошибка:', error);
        if (console) console.log(error);
      });
  }

  async test() {
    const testUpdate = async () => {
      const article = '3TD01J301';
      const updateCardProductDto = new UpdateCardProductDto({
        year_start_production: 2011,
        year_end_production: null,
        model: undefined,
      });
      return await this.cardProductService.updateByArticle(
        article,
        updateCardProductDto,
      );
    };

    const testCreate = async () => {
      const createCardProductDto = new CreateCardProductDto({
        article: 'asdasdasd',
        in_stock: 1212,
        detail_name: 'asdasdasd',
        included_in_unit: 'asdasdasd',
        brand: 'asdasdasd',
        model: 'asdasdasd',
        version: 'asdasdasd',
        body_type: 'asdasdasd',
        year: 1232131,
        engine: 'asdasdasd',
        volume: 'asdasdasd',
        engine_type: 'asdasdasd',
        gearbox: 'asdasdasd',
        original_number: 'asdasdasd',
        price: 12313.123213,
        for_naked: 'asdasdasd',
        currency: 'asdasdasd',
        discount: 123123213,
        description: 'asdasdasd',
        year_start_production: 123213,
        year_end_production: 123,
        url_photo_details: 'asdasdasd',
        url_car_photo: 'asdasdasd',
        video: 'asdasdasd',
        phone: 'asdasdasd',
        vin: 'asdasdasd',
      });
      return await this.cardProductService.create(createCardProductDto);
    };

    const testCreateMany = async () => {
      const createCardProductDtos: CreateCardProductDto[] = [
        new CreateCardProductDto({
          article: 'asdasdasdsa',
          in_stock: 1212,
          detail_name: 'asdasdasd',
          included_in_unit: 'asdasdasd',
          brand: 'asdasdasd',
          model: 'asdasdasd',
          version: 'asdasdasd',
          body_type: 'asdasdasd',
          year: 1232131,
          engine: 'asdasdasd',
          volume: 'asdasdasd',
          engine_type: 'asdasdasd',
          gearbox: 'asdasdasd',
          original_number: 'asdasdasd',
          price: 12313.123213,
          for_naked: 'asdasdasd',
          currency: 'asdasdasd',
          discount: 123123213,
          description: 'asdasdasd',
          year_start_production: 123213,
          year_end_production: 123,
          url_photo_details: 'asdasdasd',
          url_car_photo: 'asdasdasd',
          video: 'asdasdasd',
          phone: 'asdasdasd',
          vin: 'asdasdasd',
        }),
        new CreateCardProductDto({
          article: 'asdasdasd',
          in_stock: 1212,
          detail_name: 'asdasdasd',
          included_in_unit: 'asdasdasd',
          brand: 'asdasdasd',
          model: 'asdasdasd',
          version: 'asdasdasd',
          body_type: 'asdasdasd',
          year: 1232131,
          engine: 'asdasdasd',
          volume: 'asdasdasd',
          engine_type: 'asdasdasd',
          gearbox: 'asdasdasd',
          original_number: 'asdasdasd',
          price: 12313.123213,
          for_naked: 'asdasdasd',
          currency: 'asdasdasd',
          discount: 123123213,
          description: 'asdasdasd',
          year_start_production: 123213,
          year_end_production: 123,
          url_photo_details: 'asdasdasd',
          url_car_photo: 'asdasdasd',
          video: 'asdasdasd',
          phone: 'asdasdasd',
          vin: 'asdasdasd',
        }),
        new CreateCardProductDto({
          article: 'hgfhfghfg',
          in_stock: 1212,
          detail_name: 'asdasdasd',
          included_in_unit: 'asdasdasd',
          brand: 'asdasdasd',
          model: 'asdasdasd',
          version: 'asdasdasd',
          body_type: 'asdasdasd',
          year: 1232131,
          engine: 'asdasdasd',
          volume: 'asdasdasd',
          engine_type: 'asdasdasd',
          gearbox: 'asdasdasd',
          original_number: 'asdasdasd',
          price: 12313.123213,
          for_naked: 'asdasdasd',
          currency: 'asdasdasd',
          discount: 123123213,
          description: 'asdasdasd',
          year_start_production: 123213,
          year_end_production: 123,
          url_photo_details: 'asdasdasd',
          url_car_photo: 'asdasdasd',
          video: 'asdasdasd',
          phone: 'asdasdasd',
          vin: 'asdasdasd',
        }),
      ];

      const result = await this.cardProductService.createMany(
        createCardProductDtos,
      );

      return result;
    };

    return await testCreateMany();
  }
}
