import { CardProduct } from '@app/sparescsv/interface/types';
import { Injectable, Logger } from '@nestjs/common';
import { CardProductService } from '@repository/repository/card-product/card-product.service';
import { CreateCardProductDto } from '@repository/repository/card-product/dto/create-card-product.dto';
import { CardProductDB } from '@repository/repository/card-product/types/card-product-db';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { SearcherCardProductService } from '../spares/services/searcher-card-product.service';

@Injectable()
export class TestttService {
  private readonly logger = new Logger(TestttService.name);

  constructor(
    private readonly cardProductService: CardProductService,
    private readonly searcherCardProduct: SearcherCardProductService,
  ) {}

  // REFACTOR Это потом удалим
  async downloadDatabase() {
    const handleStream = async (rows: CardProductDB[]) => {
      this.logger.log(`Обработка данных для бд...`);

      const createsDto = rows.map((row) => {
        if (row.year_end_production < 1900) {
          row.year_end_production = 2023;
        } else if (row.year_end_production - row.year_start_production > 9) {
          row.year_end_production = row.year_start_production + 9;
        }

        const createCardProductDto = new CreateCardProductDto(row);

        return createCardProductDto;
      });

      this.logger.log(`Загрузка в бд...`);

      const max = 2500;

      for (let i = 0; i < createsDto.length; i += max) {
        if (i % max === 0) {
          await this.cardProductService.createMany(
            createsDto.slice(i, i + max),
          );
        }
      }
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
          volume: toNumber(obj['Объем']),
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

    this.logger.log('Началось обновление базы данных...');

    await parseCsvToJson()
      .then(async (rows) => {
        this.logger.log('Передача данных в handler');
        await handleStream(rows as CardProductDB[]);
        this.logger.log('✔ Загрузка завершена ✔');
      })
      .catch((error) => {
        this.logger.error('Произошла ошибка:', error);
      });
  }
}
