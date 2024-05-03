import { SparesCsvService } from '@app/sparescsv';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CardProductService } from '@repository/repository';
import { UpdateCardProductDto } from '@repository/repository/card-product/dto/update-card-product.dto';

@Injectable()
export class SparesService {
  constructor(
    public sparesService: SparesCsvService,
    private dbCreate: CardProductService,
    private readonly cardProductService: CardProductService,
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

  public async cvsUpdate(file) {
    const response = await this.sparesService.cvsUpdate(file);
    return response;
  }

  public async cvsDownload(url: string) {
    console.log('started parsing');
    const fullestRepository: string | null =
      this.dbCreate.checkFullBooleanFunction();

    const response: any = await this.sparesService.parseCvsToJson(url);
    console.log('ended parsing. starting db creating');

    for (const element of response) {
      const data = new UpdateCardProductDto(element);
      await this.dbCreate.updateDatabase(data);
    }

    this.dbCreate.changingTransactionDatabase(fullestRepository);
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

  public async searchFileWithId({ id }) {
    const response = await this.dbCreate.searchById(id);
    return this.sortAndReturnElementForCriteriaFunctions(response);
  }

  public async searchFileWithOriginalNumber({ original_number }) {
    const response =
      await this.dbCreate.searchByOriginalNumber(original_number);
    return this.sortAndReturnElementForCriteriaFunctions(response);
  }

  public async searchFileWithArticle({ article }) {
    const response = await this.dbCreate.searchByArticle(article);
    return this.sortAndReturnElementForCriteriaFunctions(response);
  }

  public async searchFileIdAndOther(query) {
    const { article, original_number, id } = query;

    if (article || original_number || id) {
      const response = this.cardProductService.searchBy3Parametres(
        article,
        original_number,
        id,
      );
      return this.sortAndReturnElementForCriteriaFunctions(response);
    }
  }
}
