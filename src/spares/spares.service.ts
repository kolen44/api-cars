import { SparesCsvService } from '@app/sparescsv';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateCardProductDto } from 'libs/constructor/firstfile/update-card-product.dto';
import { UpdateCardProductSecondFIleDto } from 'libs/constructor/second-file/update-card-product-second.dto';
import { CardProductService } from 'libs/functions/src';
import { FindProductQueryDto } from './dto/find-product-query.dto';
import { SearcherCardProductService } from './services/searcher-card-product.service';

@Injectable()
export class SparesService {
  constructor(
    public sparesService: SparesCsvService,
    private dbCreate: CardProductService,
    private readonly searcherCardProduct: SearcherCardProductService,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  handleCron() {
    try {
      this.cvsDownload('https://db.f-opt.com/csvfiles/abw/spares.csv');
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  handleCronSecondFile() {
    try {
      this.cvsDownloadSecondFile(
        'https://export.autostrong-m.ru/dataexports/2023/webston.ru_MinskMoskvaPiter.csv',
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  handleCronThirdFile() {
    try {
      this.cvsDownloadSecondFile(
        'https://export.autostrong-m.ru/dataexports/2023/webston.ru_Kross.csv',
      );
    } catch (error) {
      console.log(error);
      return error;
    }
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

    const BATCH_SIZE = 100; // Выберите оптимальный размер батча
    const MAX_CONCURRENT_BATCHES = 5; // Ограничение на количество параллельных запросов

    const batches = [];
    for (let i = 0; i < response.length; i += BATCH_SIZE) {
      const batch = response
        .slice(i, i + BATCH_SIZE)
        .map((element) => new UpdateCardProductDto(element));
      batches.push(batch);
    }

    for (let i = 0; i < batches.length; i += MAX_CONCURRENT_BATCHES) {
      const batchPromises = batches
        .slice(i, i + MAX_CONCURRENT_BATCHES)
        .map(async (batch, index) => {
          try {
            await this.dbCreate.updateDatabaseBatch(batch);
          } catch (error) {
            console.error(`Error processing batch ${i + index}`, error);
          }
        });

      await Promise.all(batchPromises);
      // Добавляем небольшую задержку, чтобы уменьшить нагрузку на базу данных
      await this.delay(100);
    }

    console.log('All batches processed');
    return response;
  }

  public async cvsDownloadSecondFile(url: string) {
    console.log('started parsing');

    const response: any =
      await this.sparesService.parseCvsToJsonSecondFile(url);
    console.log('ended parsing. starting db creating');

    const BATCH_SIZE = 100; // Выберите оптимальный размер батча
    const MAX_CONCURRENT_BATCHES = 5; // Ограничение на количество параллельных запросов

    const batches = [];
    for (let i = 0; i < response.length; i += BATCH_SIZE) {
      const batch = response
        .slice(i, i + BATCH_SIZE)
        .map((element) => new UpdateCardProductSecondFIleDto(element));
      batches.push(batch);
    }

    for (let i = 0; i < batches.length; i += MAX_CONCURRENT_BATCHES) {
      const batchPromises = batches
        .slice(i, i + MAX_CONCURRENT_BATCHES)
        .map(async (batch, index) => {
          try {
            await this.dbCreate.updateDatabaseForSecondFileBatch(batch);
          } catch (error) {
            console.error(`Error processing batch ${i + index}`, error);
          }
        });

      await Promise.all(batchPromises);
      // Добавляем небольшую задержку, чтобы уменьшить нагрузку на базу данных
      await this.delay(100);
    }

    console.log('All batches processed');
    return response;
  }

  sortAndReturnElementForCriteriaFunctions(response) {
    if (!response) {
      return 'Убедитесь что вы правильно передали параметры или что элемент существует в базе данных';
    }
    try {
      response.sort((a, b) => a.price - b.price);
      response.sort((a, b) => a.id - b.id);
    } catch (error) {
      return response;
    }
    return response;
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

    const findCardProduct = await this.searcherCardProduct.search(query);

    const skip = (page - 1) * limit;
    const result = await findCardProduct.getMany({
      skip,
      limit,
      sort: { key: sort, order },
    });

    return {
      page,
      limit,
      search_count: result.length,
      data: this.sortAndReturnElementForCriteriaFunctions(result),
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
