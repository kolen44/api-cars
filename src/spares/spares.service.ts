import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter } from 'events';
import { SparesCsvService } from 'libs/csv-files/sparescsv/src';

import { UpdateCardProductDto } from 'libs/csv-files/constructor/firstfile/update-card-product.dto';
import { UpdateCardProductSecondFIleDto } from 'libs/csv-files/constructor/second-file/update-card-product-second.dto';
import { UpdateCardProductThirdFIleDto } from 'libs/csv-files/constructor/thirdfile/update-card-product-third.dto';
import { CardProductService } from 'libs/csv-files/functions/src';
import { CardProductThirdFile } from 'libs/csv-files/interface/thirdfile/csvthird(102)';
import { FindProductQueryDto } from './dto/find-product-query.dto';
import { SearcherCardProductService } from './services/searcher-card-product.service';

@Injectable()
export class SparesService {
  private eventEmitter = new EventEmitter();
  private BATCH_SIZE = 200; // Выберите оптимальный размер батча
  private MAX_CONCURRENT_BATCHES = 6; // Ограничение на количество параллельных запросов
  private CSV_TO_BATCH_DELLAY = 50;
  private CSV_DATABASE_DELLAY = 300; // Время на передышку для бд
  private CSV_DATABASE_SECOND_DELLAY = 300; // Время на передышку для бд

  constructor(
    public sparesService: SparesCsvService,
    private dbCreate: CardProductService,
    private readonly searcherCardProduct: SearcherCardProductService,
  ) {
    this.setupEventListeners();
  }
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCron() {
    try {
      await this.cvsDownload('https://db.f-opt.com/csvfiles/abw/spares.csv');
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  private setupEventListeners() {
    this.eventEmitter.on('firstFileDownloaded', () => {
      this.cvsDownloadSecondFile(
        'https://export.autostrong-m.ru/dataexports/2023/webston.ru_Kross.csv',
      );
    });

    this.eventEmitter.on('secondFileDownloaded', () => {
      this.cvsDownloadSecondFile(
        'https://export.autostrong-m.ru/dataexports/2023/webston.ru_MinskMoskvaPiter.csv',
      );
    });
  }

  public async cvsUpdate(file) {
    const response = await this.sparesService.cvsUpdate(file);
    return response;
  }

  public async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async cvsDownload(url: string) {
    console.log('started parsing');

    const response: any = await this.sparesService.parseCvsToJson(url);
    console.log('ended parsing. starting db creating');

    const batches = [];
    for (let i = 0; i < response.length; i += this.BATCH_SIZE) {
      const batch = response
        .slice(i, i + this.BATCH_SIZE)
        .map((element) => new UpdateCardProductDto(element));
      await this.delay(this.CSV_TO_BATCH_DELLAY);
      batches.push(batch);
    }

    for (let i = 0; i < batches.length; i += this.MAX_CONCURRENT_BATCHES) {
      const batchPromises = batches
        .slice(i, i + this.MAX_CONCURRENT_BATCHES)
        .map(async (batch, index) => {
          try {
            await this.dbCreate.updateDatabaseBatch(batch);
          } catch (error) {
            console.error(`Error processing batch ${i + index}`, error);
          }
        });

      await Promise.all(batchPromises);
      // Добавляем небольшую задержку, чтобы уменьшить нагрузку на базу данных
      await this.delay(this.CSV_DATABASE_DELLAY);
    }

    console.log('All batches processed');
    batches.length = 0;
    this.eventEmitter.emit('firstFileDownloaded');
    return;
  }

  public async cvsDownloadSecondFile(url: string) {
    console.log('started parsing');
    const response: any =
      await this.sparesService.parseCvsToJsonSecondFile(url);
    console.log('ended parsing. starting db creating');
    const batches = [];
    for (let i = 0; i < response.length; i += this.BATCH_SIZE) {
      const batch = response
        .slice(i, i + this.BATCH_SIZE)
        .map((element) => new UpdateCardProductSecondFIleDto(element));
      batches.push(batch);
      await this.delay(this.CSV_TO_BATCH_DELLAY);
    }
    for (let i = 0; i < batches.length; i += this.MAX_CONCURRENT_BATCHES) {
      const batchPromises = batches
        .slice(i, i + this.MAX_CONCURRENT_BATCHES)
        .map(async (batch, index) => {
          try {
            await this.dbCreate.updateDatabaseForSecondFileBatch(batch);
          } catch (error) {
            console.error(`Error processing batch ${i + index}`, error);
          }
        });

      await Promise.all(batchPromises);
      // Добавляем небольшую задержку, чтобы уменьшить нагрузку на базу данных
      await this.delay(this.CSV_DATABASE_SECOND_DELLAY);
    }

    console.log('All batches processed');
    if (
      url ===
      'https://export.autostrong-m.ru/dataexports/2023/webston.ru_Kross.csv'
    ) {
      this.eventEmitter.emit('secondFileDownloaded');
    }
    batches.length = 0;
    return;
  }

  public async cvsDownloadThirdFile(url: string) {
    console.log('started parsing');
    const response: any = await this.sparesService.parseCvsToJsonThirdFile(url);
    console.log('ended parsing. starting db creating');
    const batches = [];
    for (let i = 0; i < response.length; i += this.BATCH_SIZE) {
      const batch = response
        .slice(i, i + this.BATCH_SIZE)
        .map(
          (element: CardProductThirdFile) =>
            new UpdateCardProductThirdFIleDto(element),
        );
      batches.push(batch);
      await this.delay(this.CSV_TO_BATCH_DELLAY);
    }
    for (let i = 0; i < batches.length; i += this.MAX_CONCURRENT_BATCHES) {
      const batchPromises = batches
        .slice(i, i + this.MAX_CONCURRENT_BATCHES)
        .map(async (batch, index) => {
          try {
            await this.dbCreate.updateDatabaseForThirdFileBatch(batch);
          } catch (error) {
            console.error(`Error processing batch ${i + index}`, error);
          }
        });

      await Promise.all(batchPromises);
      // Добавляем небольшую задержку, чтобы уменьшить нагрузку на базу данных
      await this.delay(this.CSV_DATABASE_SECOND_DELLAY);
    }

    console.log('All batches processed');
    this.eventEmitter.emit('thirdFileDownloaded');

    batches.length = 0;
    return;
  }

  private sortAndReturnElementForCriteriaFunctions(response) {
    if (!response) {
      return 'Убедитесь, что вы правильно передали параметры или что элемент существует в базе данных';
    }

    // Фильтруем null значения и не-null значения отдельно
    const nonNullValues = response.filter((item) => item !== null);
    const nullValues = response.filter((item) => item === null);

    // Объединяем не-null значения с null значениями, чтобы null значения были в конце
    const sortedResponse = [...nonNullValues, ...nullValues];

    return sortedResponse;
  }

  public async searchByCriteria({ brand, model, year }): Promise<any> {
    const response = await this.dbCreate.searchByCriteria(brand, model, year);

    return this.sortAndReturnElementForCriteriaFunctions(response);
  }

  public async searchByEngineVolumeCriteria({
    brand,
    model,
    year,
    engine,
    volume,
    detail_name,
  }) {
    const response = await this.dbCreate.searchByEngineVolumeCriteria(
      brand,
      model,
      year,
      engine,
      volume,
      detail_name,
    );
    return this.sortAndReturnElementForCriteriaFunctions(response);
  }

  public async searchFileWithDetailName({ brand, model, year, detail_name }) {
    const response = await this.dbCreate.searchByWithDetailName(
      brand,
      model,
      year,
      detail_name,
    );
    return this.sortAndReturnElementForCriteriaFunctions(response);
  }

  public async searchFileWithBrandName({ brand }) {
    const response = await this.dbCreate.searchByWithBrandName(brand);
    return this.sortAndReturnElementForCriteriaFunctions(response);
  }

  public async getProduct(query: FindProductQueryDto) {
    const { page, limit, sort, order } = query;

    const skip = (page - 1) * limit;

    const findCardProduct = await this.searcherCardProduct.search(query);
    const result = await findCardProduct.getMany({
      skip,
      limit,
      sort: { key: sort, order },
    });

    // Оптимизация возвращаемых данных
    const data = this.sortAndReturnElementForCriteriaFunctions(result);

    return {
      page,
      limit,
      search_count: result.length,
      data,
    };
  }

  public async searchBy3Parameters({
    article = undefined,
    original_number = undefined,
    id = undefined,
  }) {
    if (article || original_number || id) {
      const response = await this.dbCreate.searchBy3Parameters(
        article,
        original_number,
        id,
      );
      return this.sortAndReturnElementForCriteriaFunctions(response);
    } else {
      return { message: 'Нет параметров для поиска' };
    }
  }

  public async findSparePartsByParameters({
    brand = undefined,
    model = undefined,
    year = undefined,
    engine = undefined,
    volume = undefined,
    detail_name = undefined,
  }) {
    if (brand || model || year || engine || volume || detail_name) {
      const response = await this.dbCreate.findSparePartsByParameters(
        brand,
        model,
        year,
        engine,
        volume,
        detail_name,
      );
      return this.sortAndReturnElementForCriteriaFunctions(response);
    } else {
      return { message: 'Нет параметров для поиска' };
    }
  }
}
