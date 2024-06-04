import { SparesCsvService } from '@app/sparescsv';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CardProductService } from '@repository/repository';
import { UpdateCardProductSecondFIleDto } from '@repository/repository/card-product/dto/second-file/update-card-product-second.dto';
import { UpdateCardProductDto } from '@repository/repository/card-product/dto/update-card-product.dto';
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
      this.cvsDownload(
        'https://export.autostrong-m.ru/dataexports/2023/webston.ru_MinskMoskvaPiter.csv',
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

  public async cvsDownload(url: string) {
    console.log('started parsing');

    const response: any = await this.sparesService.parseCvsToJson(url);
    console.log('ended parsing. starting db creating');

    for (const element of response) {
      const data = new UpdateCardProductDto(element);
      await this.dbCreate.updateDatabase(data);
    }

    console.log('created');
    return response;
  }

  public async cvsDownloadSecondFile(url: string) {
    console.log('started parsing');

    const response: any =
      await this.sparesService.parseCvsToJsonSecondFile(url);
    console.log('ended parsing. starting db creating');

    for (const element of response) {
      const data = new UpdateCardProductSecondFIleDto(element);
      await this.dbCreate.updateDatabaseForSecondFile(data);
    }

    console.log('created');
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
